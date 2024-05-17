import { useEffect, useRef, useState } from "react";

export default function YoutubePlayer({ videoId }) {
    const playerRef = useRef(null); // Reference to the div element that will contain the YouTube player
    const ytPlayer = useRef(null); // Reference to the YouTube player instance
    const [isPlaying, setIsPlaying] = useState(false); // State to track whether the video is playing
    const pauseTimeoutRef = useRef(null); // Reference to store the pause timeout ID
    const resumeTimeoutRef = useRef(null); // Reference to store the resume timeout ID

    const [pauseTime, setPauseTime] = useState(1); // State for the pause timer (in seconds)
    const [resumeTime, setResumeTime] = useState(10); // State for the resume timer (in seconds)

    const startPauseResumeLoop = () => {
        clearTimeout(pauseTimeoutRef.current);
        clearTimeout(resumeTimeoutRef.current);

        pauseTimeoutRef.current = setTimeout(() => {
            ytPlayer.current.pauseVideo();
            setIsPlaying(false);

            resumeTimeoutRef.current = setTimeout(() => {
                ytPlayer.current.playVideo();
                setIsPlaying(true);
                startPauseResumeLoop(); // Restart the loop
            }, resumeTime * 1000); // Resume the video after resumeTime seconds
        }, pauseTime * 1000); // Pause the video after pauseTime seconds
    };

    const toggleVideo = () => {
        if (ytPlayer.current) {
            if (isPlaying) {
                ytPlayer.current.pauseVideo();
                clearTimeout(pauseTimeoutRef.current); // Clear any existing pause timeout
                clearTimeout(resumeTimeoutRef.current); // Clear any existing resume timeout
            } else {
                ytPlayer.current.playVideo();
                setIsPlaying(true); // Update the state to playing
                startPauseResumeLoop(); // Start the loop
            }
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
                clearTimeout(pauseTimeoutRef.current); // Clear pause timeout on component unmount
                clearTimeout(resumeTimeoutRef.current); // Clear resume timeout on component unmount
            };
        } else {
            onYouTubeIframeAPIReady();
        }
    }, [videoId]);

    return (
        <>
            <div ref={playerRef}></div>
            <div>
                <label>
                    Pause Time (seconds):
                    <input
                        type="number"
                        value={pauseTime}
                        onChange={(e) => setPauseTime(Number(e.target.value))}
                        min="1"
                    />
                </label>
                <label>
                    Resume Time (seconds):
                    <input
                        type="number"
                        value={resumeTime}
                        onChange={(e) => setResumeTime(Number(e.target.value))}
                        min="1"
                    />
                </label>
            </div>
            <button onClick={toggleVideo}>{isPlaying ? 'Pause Video' : 'Play Video'}</button>
        </>
    );
}
