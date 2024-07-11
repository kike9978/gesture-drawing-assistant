import React, { useState, useEffect, useRef, useCallback } from 'react';
import CircularCountdown from './CircularCountdown';

const YouTubePlayer = ({ videoId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [pauseDuration, setPauseDuration] = useState(10);
    const [playDuration, setPlayDuration] = useState(1);
    const [countdown, setCountdown] = useState(null);
    const [isHolding, setIsHolding] = useState(false);
    const playerRef = useRef(null);
    const playTimerRef = useRef(null);
    const pauseTimerRef = useRef(null);
    const [preciseCountdown, setPreciseCountdown] = useState(null);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = initializePlayer;

        return () => {
            window.onYouTubeIframeAPIReady = null;
        };
    }, []);

    const initializePlayer = useCallback(() => {
        playerRef.current = new window.YT.Player('youtube-player', {
            height: '360',
            width: '640',
            videoId: videoId,
            playerVars: {
                rel: 0,
                modestbranding: 1,
                controls: 1,
                iv_load_policy: 3,
            },
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    }, [videoId]);

    useEffect(() => {
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById(videoId);
        } else if (window.YT && window.YT.Player) {
            initializePlayer();
        }
    }, [videoId, initializePlayer]);

    const onPlayerReady = (event) => {
        console.log('Player is ready');
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
            if (!isHolding) {
                startPlayTimer();
            }
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            clearTimeout(playTimerRef.current);
        }
    };

    const clearAllTimers = () => {
        clearTimeout(playTimerRef.current);
        clearTimeout(pauseTimerRef.current);
    };

    const startPlayTimer = useCallback(() => {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = setTimeout(() => {
            if (playerRef.current && playerRef.current.pauseVideo && !isHolding) {
                playerRef.current.pauseVideo();
                startPauseTimer();
            }
        }, playDuration * 1000);
    }, [playDuration, isHolding]);

    const startPauseTimer = useCallback(() => {
        let remainingTime = pauseDuration;
        setPreciseCountdown(remainingTime);

        const countdownTick = () => {
            remainingTime -= 0.1;
            setPreciseCountdown(remainingTime);

            if (remainingTime <= 0) {
                if (playerRef.current && playerRef.current.playVideo && !isHolding) {
                    playerRef.current.playVideo();
                }
            } else {
                pauseTimerRef.current = setTimeout(countdownTick, 100);
            }
        };

        pauseTimerRef.current = setTimeout(countdownTick, 100);
    }, [pauseDuration, isHolding]);

    useEffect(() => {
        return () => {
            clearAllTimers();
        };
    }, []);

    useEffect(() => {
        if (isPlaying && !isHolding) {
            startPlayTimer();
        }
    }, [playDuration, isPlaying, isHolding, startPlayTimer]);

    const handlePlayDurationChange = (e) => {
        setPlayDuration(Number(e.target.value));
    };

    const handlePauseDurationChange = (e) => {
        setPauseDuration(Number(e.target.value));
    };

    const toggleHold = () => {
        setIsHolding((prev) => !prev);
        if (!isHolding) {
            clearAllTimers();
            if (playerRef.current && playerRef.current.pauseVideo) {
                playerRef.current.pauseVideo();
            }
        } else {
            if (playerRef.current && playerRef.current.playVideo) {
                playerRef.current.playVideo();
            }
        }
    };



    return (
        <div className="flex flex-col items-center space-y-4">
            <div id="youtube-player"></div>
            <div className="flex space-x-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Play Duration (seconds):
                        <input
                            type="number"
                            value={playDuration}
                            onChange={handlePlayDurationChange}
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Pause Duration (seconds):
                        <input
                            type="number"
                            value={pauseDuration}
                            onChange={handlePauseDurationChange}
                            min="1"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                </div>
            </div>
            <button
                onClick={toggleHold}
                className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
            >
                {isHolding ? 'Resume' : 'Hold'}
            </button>
            <div className="text-center">
                <p className="text-lg font-semibold mb-2">Status:</p>
                {isHolding ? (
                    <span className="text-yellow-600">Holding</span>
                ) : isPlaying ? (
                    <span className="text-green-600">Playing</span>
                ) : preciseCountdown !== null ? (
                    <div className="flex flex-col items-center">
                        <span className="text-red-600 mb-2">Paused</span>
                        <CircularCountdown countdown={preciseCountdown} duration={pauseDuration} />
                    </div>
                ) : (
                    <span className="text-gray-600">Initial State</span>
                )}
            </div>

        </div >
    );
};


export default YouTubePlayer;