import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({ videoId }) => {
    const playerRef = useRef(null);
    const timeoutRef = useRef(null);
    const resumeTimeoutRef = useRef(null);
    const [pauseDuration, setPauseDuration] = useState(2);
    const [resumeDelay, setResumeDelay] = useState(1);
    const pauseDurationRef = useRef(pauseDuration);
    const resumeDelayRef = useRef(resumeDelay);
    const [isApiReady, setIsApiReady] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [resumeCountdown, setResumeCountdown] = useState(null);
    const countdownIntervalRef = useRef(null);
    const [isHolding, setIsHolding] = useState(false);

    // Update refs whenever values change
    useEffect(() => {
        pauseDurationRef.current = pauseDuration;
    }, [pauseDuration]);

    useEffect(() => {
        resumeDelayRef.current = resumeDelay;
    }, [resumeDelay]);

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
        // Don't start timers if we're holding
        if (isHolding) return;

        // Clear any existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }

        // Start countdown for pause
        startCountdown(pauseDurationRef.current, setCountdown, () => {
            if (playerRef.current) {
                playerRef.current.pauseVideo();
                // Start countdown for resume
                startCountdown(resumeDelayRef.current, setResumeCountdown, () => {
                    if (playerRef.current) {
                        playerRef.current.playVideo();
                    }
                });
            }
        });

        // Set timeout to pause video
        timeoutRef.current = setTimeout(() => {
            if (playerRef.current) {
                playerRef.current.pauseVideo();
                
                // Set timeout to resume video after specified delay
                resumeTimeoutRef.current = setTimeout(() => {
                    if (playerRef.current) {
                        playerRef.current.playVideo();
                    }
                }, resumeDelayRef.current * 1000);
            }
        }, pauseDurationRef.current * 1000);
    };

    const handleHoldToggle = () => {
        setIsHolding(prev => {
            const newHoldState = !prev;
            if (newHoldState) {
                // Clear any existing timeouts and countdowns
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
                setCountdown(null);
                setResumeCountdown(null);
                // Pause the video
                playerRef.current?.pauseVideo();
            } else {
                // Resume the video when hold is released
                playerRef.current?.playVideo();
            }
            return newHoldState;
        });
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
                rel: 0,            // Disable related videos
                showinfo: 0,       // Hide video title and uploader
                controls: 1,       // Show video controls
                iv_load_policy: 3, // Hide video annotations
                fs: 1,            // Enable fullscreen button
                playsinline: 1,    // Play inline on mobile devices
            },
            events: {
                onStateChange: (event) => {
                    // When video starts playing (state 1)
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        startPauseResumeTimer();
                    }
                }
            }
        });

        return () => {
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
                {/* Hold Button */}
                <button
                    onClick={handleHoldToggle}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        isHolding 
                            ? 'bg-yellow-500 text-white hover:bg-yellow-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {isHolding ? 'Release Hold' : 'Hold Frame'}
                </button>

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