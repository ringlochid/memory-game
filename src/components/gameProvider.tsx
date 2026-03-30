import type { CardMeta, GameContextType, GameMeta, GameState, MultiplayerMeta, SoloMeta, PlayerMeta } from "../contexts/gameContext";
import { DEFAULT_GAME_META, GameContext } from "../contexts/gameContext";
import { useReducer } from "react";
import { getRandomIcons } from "../utils/icons";

export interface SubmitGameFormProps {
    type: "submitGameForm";
    gameMeta: GameMeta;
}

export interface FlipCardProps {
    type: "flipCard";
    cardId: number;
}

export interface ResolveSelectedCardsProps {
    type: "resolveSelectedCards";
}

export interface SubmitRestartProps {
    type: "submitRestart";
}

export type GameAction = SubmitGameFormProps | FlipCardProps | ResolveSelectedCardsProps | SubmitRestartProps;

function initializeCards(gameMeta: GameMeta): CardMeta[] {
    const totalCards = gameMeta.gridSize * gameMeta.gridSize;
    const pairsNeeded = totalCards / 2;

    let symbols: string[] = [];
    if (gameMeta.theme === "icons") {
        symbols = getRandomIcons(pairsNeeded);
    } else {
        symbols = Array.from({ length: pairsNeeded }, (_, i) => String(i + 1));
    }

    const deck = [...symbols, ...symbols];

    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    const initialCards: CardMeta[] = deck.map((value, index) => ({
        id: index,
        theme: gameMeta.theme,
        value: value,
        isFlipped: false,
        isMatched: false,
    }));

    return initialCards;
}

function initializeSoloMeta(): SoloMeta {
    return {
        movesTaken: 0,
    }
}

function initializeMultiplayerMeta(gameMeta: GameMeta): MultiplayerMeta {
    const players: PlayerMeta[] = [];
    for (let i = 0; i < gameMeta.playerCount; i++) {
        players.push({
            id: i,
            score: 0,
        });
    }
    return {
        players,
        currentPlayerID: 0,
    };
}

function createGameState(gameMeta: GameMeta): GameState {
    return {
        gameMeta,
        soloMeta: gameMeta.playerCount === 1 ? initializeSoloMeta() : null,
        multiplayerMeta: gameMeta.playerCount > 1 ? initializeMultiplayerMeta(gameMeta) : null,
        cards: initializeCards(gameMeta),
        selectedCardIds: [],
        isResolving: false,
    };
}

function incrementSoloMoves(soloMeta: SoloMeta | null): SoloMeta | null {
    if (!soloMeta) return null;
    return {
        ...soloMeta,
        movesTaken: soloMeta.movesTaken + 1,
    };
}

function resolveMatchedTurn(state: GameState, selectedCardIds: number[]): GameState {
    return {
        ...state,
        cards: state.cards.map((card) =>
            selectedCardIds.includes(card.id)
                ? { ...card, isMatched: true, isFlipped: true }
                : card
        ),
        soloMeta: incrementSoloMoves(state.soloMeta),
        multiplayerMeta: state.multiplayerMeta
            ? {
                ...state.multiplayerMeta,
                players: state.multiplayerMeta.players.map((player) =>
                    player.id === state.multiplayerMeta?.currentPlayerID
                        ? { ...player, score: player.score + 1 }
                        : player
                ),
            }
            : null,
        selectedCardIds: [],
        isResolving: false,
    };
}

function resolveMismatchedTurn(state: GameState, selectedCardIds: number[]): GameState {
    return {
        ...state,
        cards: state.cards.map((card) =>
            selectedCardIds.includes(card.id)
                ? { ...card, isFlipped: false }
                : card
        ),
        soloMeta: incrementSoloMoves(state.soloMeta),
        multiplayerMeta: state.multiplayerMeta
            ? {
                ...state.multiplayerMeta,
                currentPlayerID: (state.multiplayerMeta.currentPlayerID + 1) % state.gameMeta.playerCount,
            }
            : null,
        selectedCardIds: [],
        isResolving: false,
    };
}

function reducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case "submitRestart": {
            return createGameState(state.gameMeta);
        }

        case "submitGameForm": {
            return createGameState(action.gameMeta);
        }

        case "flipCard": {
            if (state.isResolving || state.selectedCardIds.length >= 2) {
                return state;
            }

            const targetCard = state.cards.find((card) => card.id === action.cardId);
            if (!targetCard || targetCard.isFlipped || targetCard.isMatched) {
                return state;
            }

            const selectedCardIds = [...state.selectedCardIds, action.cardId];

            return {
                ...state,
                cards: state.cards.map((card) =>
                    card.id === action.cardId ? { ...card, isFlipped: true } : card
                ),
                selectedCardIds,
                isResolving: selectedCardIds.length === 2,
            };
        }

        case "resolveSelectedCards": {
            if (state.selectedCardIds.length !== 2) {
                return state;
            }

            const selectedCards = state.cards.filter((card) => state.selectedCardIds.includes(card.id));
            if (selectedCards.length !== 2) {
                return {
                    ...state,
                    selectedCardIds: [],
                    isResolving: false,
                };
            }

            const isMatch = selectedCards[0].value === selectedCards[1].value;

            return isMatch
                ? resolveMatchedTurn(state, state.selectedCardIds)
                : resolveMismatchedTurn(state, state.selectedCardIds);
        }

        default:
            throw new Error("unknown action type");
    }
}

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [gameState, dispatch] = useReducer(reducer, createGameState(DEFAULT_GAME_META));

    const gameContext: GameContextType = {
        gameState,
        dispatch,
    }

    return (
        <GameContext.Provider value={gameContext}>
            {children}
        </GameContext.Provider>
    );
};