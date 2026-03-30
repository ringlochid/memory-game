import { useState, useCallback, useRef, useEffect } from 'react';
import { useGame } from '../contexts/useGame';
import { useNavigate } from 'react-router';
import { useTimer } from './useTimer';
import { DEFAULT_GAME_META } from '../contexts/gameContext';

export const useGameLogic = () => {
    const { gameState, dispatch } = useGame();
    const { cards, gameMeta, selectedCardIds, isResolving } = gameState;
    const { playerCount } = gameMeta;

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const isSoloGame = playerCount === 1;
    const isGameOver = cards.length > 0 && cards.every(c => c.isMatched);
    const { timeElapsed: timerValue, handleReset } = useTimer(!isSoloGame || isGameOver || cards.length === 0);
    const navigate = useNavigate();
    
    const clearResolutionTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => {
            clearResolutionTimeout();
        };
    }, [clearResolutionTimeout]);

    useEffect(() => {
        setTimeElapsed(timerValue);
    }, [timerValue]);

    useEffect(() => {
        if (!isResolving || selectedCardIds.length !== 2) {
            return;
        }

        timeoutRef.current = setTimeout(() => {
            dispatch({ type: 'resolveSelectedCards' });
            timeoutRef.current = null;
        }, 700);

        return clearResolutionTimeout;
    }, [clearResolutionTimeout, dispatch, isResolving, selectedCardIds]);

    const handleRestart = useCallback(() => {
        clearResolutionTimeout();
        handleReset();
        setTimeElapsed(0);
        dispatch({
            type: "submitRestart",
        });
    }, [clearResolutionTimeout, dispatch, handleReset]);

    const handleSetupNewGame = useCallback(() => {
        clearResolutionTimeout();
        handleReset();
        setTimeElapsed(0);
        dispatch({
            type: "submitGameForm",
            gameMeta: DEFAULT_GAME_META,
        });
        navigate("/");
    }, [clearResolutionTimeout, dispatch, handleReset, navigate]);

    const handleCardClick = useCallback((id: number) => {
        dispatch({ type: 'flipCard', cardId: id });
    }, [dispatch]);


    return {
        handleCardClick,
        timeElapsed,
        isGameOver,
        handleRestart,
        handleSetupNewGame,
    };
};
