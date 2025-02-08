import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({ videoId, onPinToggle, isPinned, initialSettings }) => {
    const playerRef = useRef(null);
    const timeoutRef = useRef(null);
    const resumeTimeoutRef = useRef(null);
    const [pauseDuration, setPauseDuration] = useState(initialSettings?.pauseDuration || 2);
    const [resumeDelay, setResumeDelay] = useState(initialSettings?.resumeDelay || 1);
    const pauseDurationRef = useRef(pauseDuration);
    const resumeDelayRef = useRef(resumeDelay);
    const [isApiReady, setIsApiReady] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [resumeCountdown, setResumeCountdown] = useState(null);
    const countdownIntervalRef = useRef(null);
    const [isHolding, setIsHolding] = useState(false);
    const [isPlayerReady, setIsPlayerReady] = useState(false);

    // Update refs whenever values change
    useEffect(() => {
        pauseDurationRef.current = pauseDuration;
    }, [pauseDuration]);

    useEffect(() => {
        resumeDelayRef.current = resumeDelay;
    }, [resumeDelay]);

    // Update settings when initialSettings changes
    useEffect(() => {
        if (initialSettings) {
            setPauseDuration(initialSettings.pauseDuration);
            setResumeDelay(initialSettings.resumeDelay);
        }
    }, [initialSettings]);

    const formatTime = (time) => {
        return time.toFixed(1);
    };

    const startCountdown = (duration, setterFunction, onComplete) => {
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
        }

        setterFunction(duration);
        
        countdownIntervalRef.current = setInterval(() => {
            setterFunction(prev => {
                if (prev <= 0.1) {
                    clearInterval(countdownIntervalRef.current);
                    onComplete?.();
                    return null;
                }
                return +(prev - 0.1).toFixed(1);
            });
        }, 100);
    };

    // Load YouTube IFrame API only once
    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                setIsApiReady(true);
            };
        } else {
            setIsApiReady(true);
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            if (resumeTimeoutRef.current) {
                clearTimeout(resumeTimeoutRef.current);
            }
        };
    }, []);

    const startPauseResumeTimer = () => {
        if (!isPlayerReady || isHolding) return;

        // Clear existing timeouts
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);

        // Start countdown for pause
        startCountdown(pauseDurationRef.current, setCountdown, () => {
            if (playerRef.current && isPlayerReady) {
                playerRef.current.pauseVideo();
                // Start countdown for resume
                startCountdown(resumeDelayRef.current, setResumeCountdown, () => {
                    if (playerRef.current && isPlayerReady) {
                        playerRef.current.playVideo();
                    }
                });
            }
        });

        // Set timeout to pause video
        timeoutRef.current = setTimeout(() => {
            if (playerRef.current && isPlayerReady) {
                playerRef.current.pauseVideo();
                
                // Set timeout to resume video after specified delay
                resumeTimeoutRef.current = setTimeout(() => {
                    if (playerRef.current && isPlayerReady) {
                        playerRef.current.playVideo();
                    }
                }, resumeDelayRef.current * 1000);
            }
        }, pauseDurationRef.current * 1000);
    };

    const handleHoldToggle = () => {
        if (!isPlayerReady) return;

        setIsHolding(prev => {
            const newHoldState = !prev;
            if (newHoldState) {
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                setCountdown(null);
                setResumeCountdown(null);
                playerRef.current?.pauseVideo();
            } else {
                playerRef.current?.playVideo();
            }
            return newHoldState;
        });
    };

    const handlePinToggle = () => {
        const videoData = {
            videoId,
            pauseDuration,
            resumeDelay,
            title: playerRef.current?.getVideoData()?.title
        };
        onPinToggle(videoData);
    };

    // Initialize player when API is ready and videoId changes
    useEffect(() => {
        if (!isApiReady || !videoId) return;

        if (playerRef.current) {
            playerRef.current.destroy();
        }

        playerRef.current = new window.YT.Player('youtube-player', {
            videoId: videoId,
            height: '100%',
            width: '100%',
            playerVars: {
                autoplay: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                controls: 1,
                iv_load_policy: 3,
                fs: 1,
                playsinline: 1,
            },
            events: {
                onReady: (event) => {
                    setIsPlayerReady(true);
                    playerRef.current = event.target; // Store the player instance
                },
                onStateChange: (event) => {
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        startPauseResumeTimer();
                    }
                }
            }
        });

        return () => {
            setIsPlayerReady(false);
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [isApiReady, videoId]);

    return (
        <div className="flex gap-6">
            {/* Video Player */}
            <div className="flex-1">
                <div className="aspect-w-16 aspect-h-9">
                    <div id="youtube-player" className="rounded-lg"></div>
                </div>
            </div>

            {/* Controls Side Panel */}
            <div className="w-80 bg-white rounded-lg p-4 shadow-lg flex flex-col gap-6">
                <div className="flex gap-2">
                    {/* Hold Button */}
                    <button
                        onClick={handleHoldToggle}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                            isHolding 
                                ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        {isHolding ? 'Release Hold' : 'Hold Frame'}
                    </button>
                    
                    {/* Pin Button */}
                    <button
                        onClick={handlePinToggle}
                        className={`px-4 py-3 rounded-lg font-semibold transition-colors ${
                            isPinned
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        title={isPinned ? 'Unpin Video' : 'Pin Video'}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Pause controls */}
                    <div className="space-y-2">
                        <label className="flex flex-col gap-2">
                            <span className="text-gray-700 font-medium">Pause after (seconds):</span>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={pauseDuration}
                                onChange={(e) => setPauseDuration(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isHolding}
                            />
                        </label>
                    </div>

                    {/* Resume controls */}
                    <div className="space-y-2">
                        <label className="flex flex-col gap-2">
                            <span className="text-gray-700 font-medium">Resume after (seconds):</span>
                            <input
                                type="number"
                                min="1"
                                max="60"
                                value={resumeDelay}
                                onChange={(e) => setResumeDelay(Number(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={isHolding}
                            />
                        </label>
                    </div>
                </div>

                {/* Timer Display */}
                {!isHolding && (countdown !== null || resumeCountdown !== null) && (
                    <div className="border-t pt-4">
                        <div className="text-center space-y-1">
                            <span className="text-sm text-gray-600">
                                {countdown !== null ? 'Pausing in:' : 'Resuming in:'}
                            </span>
                            <div className={`text-3xl font-bold ${
                                countdown !== null ? 'text-blue-600' : 'text-green-600'
                            }`}>
                                {formatTime(countdown ?? resumeCountdown)}s
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer; 