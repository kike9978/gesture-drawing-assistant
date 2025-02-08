import React from 'react';
import CircularCountdown from './CircularCountdown';

const PlayerStatus = ({ isHolding, isPlaying, countdown, pauseDuration }) => (
    <div className="text-center">
        <p className="text-lg font-semibold mb-2">Status:</p>
        {isHolding ? (
            <span className="text-yellow-600">Holding</span>
        ) : isPlaying ? (
            <span className="text-green-600">Playing</span>
        ) : countdown !== null ? (
            <div className="flex flex-col items-center">
                <span className="text-red-600 mb-2">Paused</span>
                <CircularCountdown countdown={countdown} duration={pauseDuration} />
            </div>
        ) : (
            <span className="text-gray-600">Initial State</span>
        )}
    </div>
);

export default PlayerStatus; 