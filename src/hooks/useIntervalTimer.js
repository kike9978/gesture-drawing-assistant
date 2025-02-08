import { useState, useRef, useCallback, useEffect } from 'react';

export const useIntervalTimer = ({ playDuration, pauseDuration, onPause, onResume, isEnabled }) => {
    const [isPaused, setIsPaused] = useState(false);
    const [countdown, setCountdown] = useState(null);
    const intervalRef = useRef(null);
    const timeoutRef = useRef(null);

    const clearTimers = useCallback(() => {
        clearInterval(intervalRef.current);
        clearTimeout(timeoutRef.current);
        setCountdown(null);
    }, []);

    const startPauseCountdown = useCallback(() => {
        let remaining = pauseDuration;
        setCountdown(remaining);
        
        intervalRef.current = setInterval(() => {
            remaining -= 0.1;
            if (remaining <= 0) {
                clearTimers();
                onResume();
                setIsPaused(false);
            } else {
                setCountdown(remaining);
            }
        }, 100);
    }, [pauseDuration, onResume, clearTimers]);

    const checkAndPause = useCallback(() => {
        if (!isEnabled || isPaused) return;
        
        timeoutRef.current = setTimeout(() => {
            onPause();
            setIsPaused(true);
            startPauseCountdown();
        }, playDuration * 1000);
    }, [playDuration, isPaused, isEnabled, onPause, startPauseCountdown]);

    useEffect(() => {
        return clearTimers;
    }, [clearTimers]);

    return {
        isPaused,
        countdown,
        startTimer: checkAndPause,
        stopTimer: clearTimers
    };
}; 