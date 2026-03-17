import { useState, useCallback } from 'react';
import { useGame } from '../contexts/useGame';
import { useNavigate } from 'react-router';
import { useTimer } from './useTimer';

export const useGameLogic = () => {
    const { gameState, dispatch } = useGame();
    const { cards, gameMeta, multiplayerMeta } = gameState;
    const { playerCount } = gameMeta;

    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [isResolving, setIsResolving] = useState(false);
    
    const isGameOver = cards.length > 0 && cards.every(c => c.isMatched);
    const timeElapsed = useTimer(isGameOver); 
    const navigate = useNavigate();

    const handleRestart = useCallback(() => {
        dispatch({
            type: "submitGameForm",
            gameMeta: gameMeta
        });
    }, [dispatch, gameMeta]);

    const handleSetupNewGame = useCallback(() => {
        dispatch({
            type: "submitGameForm",
            gameMeta: {
                theme: "numbers",
                playerCount: 1,
                gridSize: 4,
            }
        });
        navigate("/");
    }, [dispatch, navigate]);
    

    const dispatchFlipCard = useCallback((cardId: number, isFlipped: boolean) => {
         const updatedCards = cards.map(card => 
            card.id === cardId ? { ...card, isFlipped } : card
        );
        dispatch({ 
            type: "submitTurn", 
            cards: updatedCards,
            movesTakenInc: 0,
            timeElapsed: timeElapsed,
            scoreIncPlayerId: null,
            nextPlayerId: null,
        });
    }, [cards, dispatch, timeElapsed]);


    const handleCardClick = useCallback((id: number) => {
        const clickedCard = cards.find(c => c.id === id);
        
        if (!clickedCard) return;                    
        if (isResolving) return;                     
        if (clickedCard.isFlipped) return;           
        if (clickedCard.isMatched) return;           

        dispatchFlipCard(id, true);
        const newFlippedIndices = [...flippedIndices, id];
        setFlippedIndices(newFlippedIndices);

        if (newFlippedIndices.length === 2) {
            setIsResolving(true); 

            const firstCardId = newFlippedIndices[0];
            const secondCardId = newFlippedIndices[1];
            
            const firstCard = cards.find(c => c.id === firstCardId);
            const secondCard = cards.find(c => c.id === secondCardId);

            if (firstCard && secondCard && firstCard.value === secondCard.value) {
                setTimeout(() => {
                    const matchedCards = cards.map(card => {
                        if (card.isMatched) return card; 
                        if (card.id === firstCardId || card.id === secondCardId) {
                            return { ...card, isMatched: true, isFlipped: true };
                        }
                        return card; 
                    });

                    dispatch({ 
                        type: "submitTurn", 
                        cards: matchedCards,
                        movesTakenInc: 1, // solo move increments on resolution
                        timeElapsed: timeElapsed, // solo mode
                        scoreIncPlayerId: multiplayerMeta ? multiplayerMeta.currentPlayerID : null, // scored a point
                        nextPlayerId: multiplayerMeta ? multiplayerMeta.currentPlayerID : null // keeps turn
                    });
                    
                    setFlippedIndices([]);
                    setIsResolving(false);
                }, 1000);

            } else {
                setTimeout(() => {
                    const nextPlayerId = multiplayerMeta ? (multiplayerMeta.currentPlayerID + 1) % playerCount : null;

                    const resetCards = cards.map(c => 
                        (c.id === firstCardId || c.id === secondCardId) 
                            ? { ...c, isFlipped: false } 
                            : c
                    );

                    dispatch({ 
                        type: "submitTurn", 
                        cards: resetCards,
                        movesTakenInc: 1,
                        timeElapsed: timeElapsed, // solo mode
                        scoreIncPlayerId: null, // no point
                        nextPlayerId // advance turn
                    });
                    
                    setFlippedIndices([]);
                    setIsResolving(false);
                }, 1000); 
            }
        }
    }, [cards, flippedIndices, isResolving, multiplayerMeta, playerCount, timeElapsed, dispatchFlipCard, dispatch]);


    return {
        handleCardClick,
        isResolving, 
        timeElapsed,
        isGameOver,
        handleRestart,
        handleSetupNewGame,
    };
};
