import { useState, useEffect, useCallback } from "react";

export function useTimer(isPaused: boolean) {
    const [time, setTime] = useState(0);

    const handleReset = useCallback(() => {
        setTime(0);
    }, []);

    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [isPaused]);

    return { timeElapsed: time, handleReset };
}