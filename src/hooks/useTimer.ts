import { useState, useEffect } from "react";

export function useTimer(isGameOver: boolean) {
    const [time, setTime] = useState(0);
    useEffect(() => {
        if (isGameOver) return;
        const interval = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [time, isGameOver]);
    return time;
}