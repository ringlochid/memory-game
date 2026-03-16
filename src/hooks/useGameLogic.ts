import { useState, useCallback } from 'react';
import { useGame } from '../contexts/useGame';

export const useGameLogic = () => {
    const { gameState, dispatch } = useGame();
    const { cards, gameMeta, multiplayerMeta } = gameState;
    const { playerCount } = gameMeta;

    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchedIndices, setMatchedIndices] = useState<number[]>([]); // for check game over
    const [isResolving, setIsResolving] = useState(false);

    const handleCurrentPlayerIDChange = useCallback((currentPlayerID: number) => {
        dispatch({ type: "submitCurrentPlayerIDChange", currentPlayerID });
    }, [dispatch]);
    
    const handleScoreUpdate = useCallback((playerId: number) => {
        if (!multiplayerMeta) return;
        dispatch({ type: "submitScoreUpdate", playerId });
    }, [multiplayerMeta, dispatch]);

    const handleEndTurn = useCallback((isMatch: boolean) => {
        if (playerCount === 1) {
            dispatch({ type: "submitMove", gameType: "solo", playerId: null });
        } else {
            if (!multiplayerMeta) return;
            const currPlayerId = multiplayerMeta.currentPlayerID;
            const nextPlayerId = (currPlayerId + 1) % playerCount;
            if (isMatch) {
                handleScoreUpdate(currPlayerId);
            }
            handleCurrentPlayerIDChange(nextPlayerId)
            dispatch({ type: "submitMove", gameType: "multiplayer", playerId: currPlayerId });
        }
    }, [playerCount, multiplayerMeta, handleScoreUpdate, handleCurrentPlayerIDChange, dispatch]);

    const dispatchFlipCard = useCallback((cardId: number, isFlipped: boolean) => {
         const updatedCards = cards.map(card => 
            card.id === cardId ? { ...card, isFlipped } : card
        );
        dispatch({ type: "submitCard", cards: updatedCards });
    }, [cards, dispatch]);


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

                    const finalSync = matchedCards.map(c => 
                        (c.id === firstCardId || c.id === secondCardId) 
                            ? { ...c, isMatched: true, isFlipped: true } 
                            : c
                    );

                    dispatch({ type: "submitCard", cards: finalSync });
                    handleEndTurn(true);
                    setFlippedIndices([]);
                    setIsResolving(false);
                }, 1000);

            } else {
                setTimeout(() => {
                    const resetCards = cards.map(c => 
                        (c.id === firstCardId || c.id === secondCardId) 
                            ? { ...c, isFlipped: false } 
                            : c
                    );
                    dispatch({ type: "submitCard", cards: resetCards });
                    handleEndTurn(false);
                    setFlippedIndices([]);
                    setIsResolving(false);
                }, 1000); 
            }
        }
    }, [cards, flippedIndices, isResolving, dispatchFlipCard, handleEndTurn, dispatch]);


    return {
        handleCardClick,
        isResolving, 
    };
};
