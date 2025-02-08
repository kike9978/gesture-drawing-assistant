import React from 'react';

const PlayerControls = ({
    playDuration,
    pauseDuration,
    onPlayDurationChange,
    onPauseDurationChange,
    isHolding,
    onHoldToggle
}) => (
    <>
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
            <DurationInput
                label="Play Duration (seconds):"
                value={playDuration}
                onChange={onPlayDurationChange}
            />
            <DurationInput
                label="Pause Duration (seconds):"
                value={pauseDuration}
                onChange={onPauseDurationChange}
            />
        </div>
        <button
            onClick={onHoldToggle}
            className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
            {isHolding ? 'Resume' : 'Hold'}
        </button>
    </>
);

const DurationInput = ({ label, value, onChange }) => (
    <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700">
            {label}
            <input
                type="number"
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
        </label>
    </div>
);

export default PlayerControls; 