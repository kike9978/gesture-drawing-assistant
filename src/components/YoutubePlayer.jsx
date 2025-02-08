import React, { useState, useCallback } from 'react';
import { useYoutubePlayer } from '../hooks/useYoutubePlayer';
import { useIntervalTimer } from '../hooks/useIntervalTimer';
import CircularCountdown from './CircularCountdown';
import PlayerControls from './PlayerControls';
import PlayerStatus from './PlayerStatus';

const ErrorMessage = ({ videoId }) => (
    <>
        <svg 
            className="w-12 h-12 text-gray-400 mb-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
        >
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
        </svg>
        <p className="text-gray-600 mb-2">This video cannot be embedded</p>
        <a 
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
        >
            Watch on YouTube
        </a>
    </>
);

const YouTubePlayer = ({ videoId }) => {
    const [playDuration, setPlayDuration] = useState(1);
    const [pauseDuration, setPauseDuration] = useState(10);
    const [isHolding, setIsHolding] = useState(false);

    const { player, isPlayerReady, isError, isPlaying } = useYoutubePlayer(videoId);

    const handlePause = useCallback(() => {
        if (player && isPlayerReady) {
            player.pauseVideo();
        }
    }, [player, isPlayerReady]);

    const handleResume = useCallback(() => {
        if (player && isPlayerReady) {
            player.playVideo();
        }
    }, [player, isPlayerReady]);

    const { countdown, startTimer, stopTimer } = useIntervalTimer({
        playDuration,
        pauseDuration,
        onPause: handlePause,
        onResume: handleResume,
        isEnabled: !isHolding && isPlayerReady
    });

    const toggleHold = useCallback(() => {
        setIsHolding(prev => {
            if (!prev) {
                stopTimer();
                handlePause();
            } else {
                handleResume();
            }
            return !prev;
        });
    }, [stopTimer, handlePause, handleResume]);

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg">
                <ErrorMessage videoId={videoId} />
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-6 w-full h-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <div id="youtube-player" className="absolute top-0 left-0 w-full h-full" />
            </div>
            
            <PlayerControls
                playDuration={playDuration}
                pauseDuration={pauseDuration}
                onPlayDurationChange={setPlayDuration}
                onPauseDurationChange={setPauseDuration}
                isHolding={isHolding}
                onHoldToggle={toggleHold}
            />

            <PlayerStatus
                isHolding={isHolding}
                isPlaying={isPlaying}
                countdown={countdown}
                pauseDuration={pauseDuration}
            />
        </div>
    );
};

export default YouTubePlayer;