import React, { useEffect, useRef, useState, useCallback } from 'react';

const DEFAULT_PAUSE_DURATION = 0.5;
const DEFAULT_RESUME_DELAY = 10;

const VideoPlayer = ({ videoId, onPinToggle, isPinned, initialSettings }) => {
    const [pauseDuration, setPauseDuration] = useState(
        isPinned ? (initialSettings?.pauseDuration || DEFAULT_PAUSE_DURATION) : DEFAULT_PAUSE_DURATION
    );
    const [resumeDelay, setResumeDelay] = useState(
        isPinned ? (initialSettings?.resumeDelay || DEFAULT_RESUME_DELAY) : DEFAULT_RESUME_DELAY
    );
    const [isHolding, setIsHolding] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const [resumeCountdown, setResumeCountdown] = useState(null);
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    
    const playerRef = useRef(null);
    const timeoutRef = useRef(null);
    const resumeTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const pauseDurationRef = useRef(pauseDuration);
    const resumeDelayRef = useRef(resumeDelay);

    useEffect(() => {
        pauseDurationRef.current = pauseDuration;
    }, [pauseDuration]);

    useEffect(() => {
        resumeDelayRef.current = resumeDelay;
    }, [resumeDelay]);

    // Update values when initialSettings changes
    useEffect(() => {
        if (initialSettings) {
            setPauseDuration(initialSettings.pauseDuration);
            setResumeDelay(initialSettings.resumeDelay);
            // Also update the refs to ensure timer uses new values immediately
            pauseDurationRef.current = initialSettings.pauseDuration;
            resumeDelayRef.current = initialSettings.resumeDelay;
        }
    }, [initialSettings]);

    // Reset to defaults when switching to an unpinned video
    useEffect(() => {
        if (!isPinned) {
            setPauseDuration(DEFAULT_PAUSE_DURATION);
            setResumeDelay(DEFAULT_RESUME_DELAY);
        } else {
            setPauseDuration(initialSettings?.pauseDuration || DEFAULT_PAUSE_DURATION);
            setResumeDelay(initialSettings?.resumeDelay || DEFAULT_RESUME_DELAY);
        }
    }, [isPinned, initialSettings]);

    const cleanupTimers = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        setCountdown(null);
        setResumeCountdown(null);
    };

    const startCountdown = useCallback((duration, setterFunction, onComplete) => {
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
    }, []);

    const startPauseResumeTimer = useCallback(() => {
        if (!playerRef.current || !isPlayerReady || isHolding) return;

        cleanupTimers();

        startCountdown(pauseDurationRef.current, setCountdown, () => {
            if (playerRef.current?.pauseVideo) {
                playerRef.current.pauseVideo();
                startCountdown(resumeDelayRef.current, setResumeCountdown, () => {
                    if (playerRef.current?.playVideo) {
                        playerRef.current.playVideo();
                    }
                });
            }
        });

        timeoutRef.current = setTimeout(() => {
            if (playerRef.current?.pauseVideo) {
                playerRef.current.pauseVideo();
                resumeTimeoutRef.current = setTimeout(() => {
                    if (playerRef.current?.playVideo) {
                        playerRef.current.playVideo();
                    }
                }, resumeDelayRef.current * 1000);
            }
        }, pauseDurationRef.current * 1000);
    }, [isPlayerReady, isHolding, startCountdown]);

    useEffect(() => {
        // Load YouTube API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = initPlayer;
        } else {
            initPlayer();
        }

        function initPlayer() {
            if (playerRef.current) {
                playerRef.current.destroy();
            }

            playerRef.current = new window.YT.Player('youtube-player', {
                videoId,
                height: '100%',
                width: '100%',
                playerVars: {
                    autoplay: 1,
                    modestbranding: 1,
                    rel: 0,
                    controls: 1,
                },
                events: {
                    onReady: () => setIsPlayerReady(true),
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            startPauseResumeTimer();
                        }
                    }
                }
            });
        }

        return () => {
            cleanupTimers();
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [videoId, startPauseResumeTimer]);

    const handleHoldToggle = () => {
        if (!playerRef.current || !isPlayerReady) return;

        setIsHolding(prev => {
            const newHoldState = !prev;
            if (newHoldState) {
                cleanupTimers();
                playerRef.current.pauseVideo();
            } else {
                playerRef.current.playVideo();
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

    // Update handlers for pause and resume duration changes
    const handlePauseDurationChange = (e) => {
        const newValue = Number(e.target.value);
        setPauseDuration(newValue);
        if (isPinned) {
            onPinToggle({
                videoId,
                pauseDuration: newValue,
                resumeDelay,
                title: playerRef.current?.getVideoData()?.title
            });
        }
    };

    const handleResumeDelayChange = (e) => {
        const newValue = Number(e.target.value);
        setResumeDelay(newValue);
        if (isPinned) {
            onPinToggle({
                videoId,
                pauseDuration,
                resumeDelay: newValue,
                title: playerRef.current?.getVideoData()?.title
            });
        }
    };

    return (
        <div className="flex gap-6">
            <div className="flex-1">
                <div className="aspect-w-16 aspect-h-9">
                    <div id="youtube-player" className="rounded-lg w-full h-full" />
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
                                onChange={handlePauseDurationChange}
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
                                onChange={handleResumeDelayChange}
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
                                {countdown !== null ? countdown.toFixed(1) : resumeCountdown.toFixed(1)}s
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoPlayer; 