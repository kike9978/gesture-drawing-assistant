import { useEffect, useRef, useState } from "react";

export default function YoutubePlayer({ videoId }) {
    const playerRef = useRef(null); // Reference to the div element that will contain the YouTube player
    const ytPlayer = useRef(null); // Reference to the YouTube player instance
    const [isPlaying, setIsPlaying] = useState(false); // State to track whether the video is playing
    const pauseTimeoutRef = useRef(null);
    const resumeTimeoutRef = useRef(null);

    const [pauseTimer, setPauseTimer] = useState(1)
    const [resumeTimer, setResumeTimer] = useState(10)

    const toggleVideo = () => {
        if (ytPlayer.current) {
            if (isPlaying) {
                ytPlayer.current.pauseVideo();
                clearTimeout(pauseTimeoutRef.current)
                clearTimeout(resumeTimeoutRef.current)
            } else {
                ytPlayer.current.playVideo();
                pauseTimeoutRef.current = setTimeout(() => {
                    ytPlayer.current.pauseVideo();
                    setIsPlaying(false);
                    resumeTimeoutRef.current = setTimeout(() => {
                        ytPlayer.current.plaYVideo();
                        setIsPlaying(true);
                    }, 1000)

                }, pauseTimer * 1000)

            }
            setIsPlaying(!isPlaying); // Toggle the playing state
        }
    };

    useEffect(() => {
        const onYouTubeIframeAPIReady = () => {
            ytPlayer.current = new window.YT.Player(playerRef.current, {
                videoId,
                playerVars: { autoplay: 0 }, // Disable autoplay
                events: {
                    onReady: () => {
                        setIsPlaying(false); // Ensure state is reset when the player is ready
                    },
                    onStateChange: (event) => {
                        if (event.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                        }
                    }
                },
            });
        };

        // Load the Iframe API
        if (!window.YT) {
            const script = document.createElement("script");
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        } else {
            onYouTubeIframeAPIReady();
        }
    }, [videoId]);

    return (
        <>
            <div ref={playerRef}></div>
            <button onClick={toggleVideo}>{isPlaying ? 'Pause Video' : 'Play Video'}</button>
            <label htmlFor="">
                pauseTime:
                <input type="number" value={pauseTimer} onChange={() => setPauseTimer(value)} />
            </label>
        </>
    );
}