import React, { useState, useEffect, useRef } from 'react';

const YouTubePlayer = ({ videoId }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [pauseDuration, setPauseDuration] = useState(5);
    const [playDuration, setPlayDuration] = useState(10);
    const [countdown, setCountdown] = useState(null);
    const playerRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Initialize player when API is ready
        window.onYouTubeIframeAPIReady = () => {
            playerRef.current = new window.YT.Player('youtube-player', {
                height: '360',
                width: '640',
                videoId: videoId,
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
            startPlayTimer();
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
            clearTimeout(timerRef.current);
        }
    };

    const startPlayTimer = () => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            if (playerRef.current && playerRef.current.pauseVideo) {
                playerRef.current.pauseVideo();
                setCountdown(pauseDuration);
                startPauseTimer();
            }
        }, playDuration * 1000);
    };

    const startPauseTimer = () => {
        let remainingTime = pauseDuration;
        const countdownInterval = setInterval(() => {
            remainingTime -= 1;
            setCountdown(remainingTime);
            if (remainingTime <= 0) {
                clearInterval(countdownInterval);
                if (playerRef.current && playerRef.current.playVideo) {
                    playerRef.current.playVideo();
                }
            }
        }, 1000);
    };

    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);
        };
    }, []);

    useEffect(() => {
        if (playerRef.current && playerRef.current.loadVideoById) {
            playerRef.current.loadVideoById(videoId);
        }
    }, [videoId]);

    const handlePlayDurationChange = (e) => {
        setPlayDuration(Number(e.target.value));
    };

    const handlePauseDurationChange = (e) => {
        setPauseDuration(Number(e.target.value));
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
                Status: {isPlaying ? 'Playing' : countdown !== null ? `Paused (${countdown}s remaining)` : 'Initial State'}
            </div>
        </div>
    );
};

export default YouTubePlayer;