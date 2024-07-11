import React, { useState, useEffect, useRef, useCallback } from 'react';

const YouTubePlayer = ({ videoId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [pauseDuration, setPauseDuration] = useState(10);
    const [playDuration, setPlayDuration] = useState(1);
    const [countdown, setCountdown] = useState(null);
    const [isHolding, setIsHolding] = useState(false);
    const playerRef = useRef(null);
    const playTimerRef = useRef(null);
    const pauseTimerRef = useRef(null);

    useEffect(() => {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = () => {
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
        };

        return () => {
            window.onYouTubeIframeAPIReady = null;
        };
    }, [videoId]);

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
        setCountdown(remainingTime);

        const countdownTick = () => {
            remainingTime -= 1;
            setCountdown(remainingTime);

            if (remainingTime <= 0) {
                if (playerRef.current && playerRef.current.playVideo && !isHolding) {
                    playerRef.current.playVideo();
                }
            } else {
                pauseTimerRef.current = setTimeout(countdownTick, 1000);
            }
        };

        pauseTimerRef.current = setTimeout(countdownTick, 1000);
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
        <div>
            <div id="youtube-player"></div>
            <div>
                <label>
                    Play Duration (seconds):
                    <input type="number" value={playDuration} onChange={handlePlayDurationChange} min="1" />
                </label>
            </div>
            <div>
                <label>
                    Pause Duration (seconds):
                    <input type="number" value={pauseDuration} onChange={handlePauseDurationChange} min="1" />
                </label>
            </div>
            <div>
                <button onClick={toggleHold}>{isHolding ? 'Resume' : 'Hold'}</button>
            </div>
            <div>
                Status: {isHolding ? 'Holding' : isPlaying ? 'Playing' : countdown !== null ? `Paused (${countdown}s remaining)` : 'Initial State'}
            </div>
        </div>
    );
};

export default YouTubePlayer;