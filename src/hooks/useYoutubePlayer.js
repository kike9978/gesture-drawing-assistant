import { useState, useEffect, useRef, useCallback } from 'react';

export const useYoutubePlayer = (videoId) => {
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [isError, setIsError] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef(null);

    const initializePlayer = useCallback(() => {
        if (!window.YT) return;
        
        playerRef.current = new window.YT.Player('youtube-player', {
            height: '360',
            width: '640',
            videoId,
            playerVars: {
                rel: 0,
                modestbranding: 1,
                controls: 1,
            },
            events: {
                onReady: () => setIsPlayerReady(true),
                onStateChange: (event) => {
                    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
                },
                onError: () => setIsError(true)
            },
        });
    }, [videoId]);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = initializePlayer;

        return () => {
            window.onYouTubeIframeAPIReady = null;
        };
    }, [initializePlayer]);

    useEffect(() => {
        if (window.YT && window.YT.Player) {
            initializePlayer();
        }
    }, [videoId, initializePlayer]);

    return {
        player: playerRef.current,
        isPlayerReady,
        isError,
        isPlaying
    };
}; 