import { useEffect, useRef, useState } from "react";

function Timer({ secondsLeft }) {
    return <p>{secondsLeft > 0 ? secondsLeft + " seconds left" : "Paused"}</p>;
}

export default function YoutubePlayer({ videoId }) {
    const playerRef = useRef(null); // Reference to the div element that will contain the YouTube player
    const ytPlayer = useRef(null); // Reference to the YouTube player instance
    const [isPlaying, setIsPlaying] = useState(false); // State to track whether the video is playing
    const [pauseTime, setPauseTime] = useState(1); // State for the pause timer (in seconds)
    const [resumeTime, setResumeTime] = useState(2); // State for the resume timer (in seconds)
    const [countdown, setCountdown] = useState(0); // State for the countdown

    const pauseTimeRef = useRef(pauseTime); // Ref to store the current value of pauseTime
    const resumeTimeRef = useRef(resumeTime); // Ref to store the current value of resumeTime

    const startPauseResumeLoop = () => {
        const timerRef = setTimeout(() => {
            ytPlayer.current.pauseVideo();
            setIsPlaying(false);
            setCountdown(resumeTimeRef.current); // Reset countdown when video is paused

            setTimeout(() => {
                ytPlayer.current.playVideo();
                setIsPlaying(true);
                startPauseResumeLoop(); // Restart the loop
            }, resumeTimeRef.current * 1000); // Resume the video after resumeTime seconds
        }, pauseTimeRef.current * 1000); // Pause the video after pauseTime seconds

        return timerRef;
    };

    const toggleVideo = () => {
        if (ytPlayer.current) {
            if (isPlaying) {
                ytPlayer.current.pauseVideo();
                setIsPlaying(false);
                setCountdown(resumeTimeRef.current); // Reset countdown when video is manually paused
            } else {
                ytPlayer.current.playVideo();
                setIsPlaying(true); // Update the state to playing
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
                            startPauseResumeLoop(); // Start the loop when video starts playing
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

    useEffect(() => {
        const countdownInterval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown > 0 ? prevCountdown - 1 : 0);
        }, 1000);

        return () => clearInterval(countdownInterval);
    }, [isPlaying]);

    useEffect(() => {
        pauseTimeRef.current = pauseTime; // Update the pauseTimeRef when pauseTime changes
    }, [pauseTime]);

    useEffect(() => {
        resumeTimeRef.current = resumeTime; // Update the resumeTimeRef when resumeTime changes
    }, [resumeTime]);

    return (
        <>
            <div ref={playerRef}></div>
            <div>
                <label>
                    Pause Time (seconds):
                    <input
                        type="number"
                        value={pauseTime}
                        onChange={(e) => {
                            setPauseTime(Number(e.target.value));
                        }}
                        min="1"
                    />
                </label>
                <label>
                    Resume Time (seconds):
                    <input
                        type="number"
                        value={resumeTime}
                        onChange={(e) => {
                            setResumeTime(Number(e.target.value));
                        }}
                        min="1"
                    />
                </label>
            </div>
            <Timer secondsLeft={countdown} />
            <button onClick={toggleVideo}>{isPlaying ? 'Pause Video' : 'Play Video'}</button>
            <button className="block" onClick={() => {
                setPauseTime(3);
            }}>test</button>
        </>
    );
}
