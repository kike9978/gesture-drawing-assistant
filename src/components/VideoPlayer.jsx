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

    // Update refs whenever values change
    useEffect(() => {
        pauseDurationRef.current = pauseDuration;
    }, [pauseDuration]);

    useEffect(() => {
        resumeDelayRef.current = resumeDelay;
    }, [resumeDelay]);

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
        // Clear any existing timeouts
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        if (resumeTimeoutRef.current) {
            clearTimeout(resumeTimeoutRef.current);
        }

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
        <div className="space-y-4">
            <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                    <span className="text-gray-700">Pause after (seconds):</span>
                    <input
                        type="number"
                        min="1"
                        max="60"
                        value={pauseDuration}
                        onChange={(e) => setPauseDuration(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>
                <label className="flex items-center gap-2">
                    <span className="text-gray-700">Resume after (seconds):</span>
                    <input
                        type="number"
                        min="1"
                        max="60"
                        value={resumeDelay}
                        onChange={(e) => setResumeDelay(Number(e.target.value))}
                        className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </label>
            </div>
            <div className="aspect-w-16 aspect-h-9">
                <div id="youtube-player" className="rounded-lg"></div>
            </div>
        </div>
    );
};

export default VideoPlayer; 