import React, { useEffect, useState } from 'react';

const CircularCountdown = ({ countdown, duration }) => {
    const [offset, setOffset] = useState(0);
    const circumference = 2 * Math.PI * 45; // 45 is the radius of our circle

    useEffect(() => {
        const interval = setInterval(() => {
            const newOffset = circumference - ((countdown - 0.1) / duration) * circumference;
            setOffset(newOffset);
        }, 100); // Update every 100ms for smoother animation

        return () => clearInterval(interval);
    }, [countdown, duration, circumference]);

    return (
        <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-gray-200"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
                <circle
                    className="text-blue-600 transition-all duration-100 ease-linear"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold">
                {Math.ceil(countdown)}
            </span>
        </div>
    );
};

export default CircularCountdown;