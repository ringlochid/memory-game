import type { CardMeta, GameContextType, GameMeta, GameState, MultiplayerMeta, SoloMeta, PlayerMeta } from "../contexts/gameContext";
import { useEffect, useReducer } from "react";
import { GameContext } from "../contexts/gameContext";
import { getRandomIcons } from "../utils/icons";

export interface SubmitGameFormProps {
    type: "submitGameForm";
    gameMeta: GameMeta;
}

export interface SubmitTurnProps {
    type: "submitTurn";
    cards: CardMeta[];
    movesTakenInc: number; // for solo logic
    timeElapsed: number; // for solo logic
    scoreIncPlayerId: number | null; // which player just scored a point
    nextPlayerId: number | null; // pass if turn advances
}

export interface SubmitTimeUpdateProps {
    type: "submitTimeUpdate";
    timeElapsed: number;
}

export interface SubmitRestartProps {
    type: "submitRestart";
}

export type GameAction = SubmitGameFormProps | SubmitTurnProps | SubmitTimeUpdateProps | SubmitRestartProps;

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
        timeElapsed: 0,
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


export const GameProvider = ({ children }: { children: React.ReactNode }) => {

    useEffect(() => {
        console.log("GameProvider MOUNTED");
        return () => console.log("GameProvider UNMOUNTED");
    }, []);

    const reducer = (state: GameState, action: GameAction) => {
        switch (action.type) {

            case "submitRestart": {
                return {
                    ...state,
                    soloMeta: state.soloMeta ? initializeSoloMeta() : null,
                    multiplayerMeta: state.multiplayerMeta ? initializeMultiplayerMeta(state.gameMeta) : null,
                    cards: initializeCards(state.gameMeta),
                };
            }

            case "submitGameForm": {
                return {
                    gameMeta: action.gameMeta,
                    soloMeta: action.gameMeta.playerCount === 1 ? initializeSoloMeta() : null,
                    multiplayerMeta: action.gameMeta.playerCount > 1 ? initializeMultiplayerMeta(action.gameMeta) : null,
                    cards: initializeCards(action.gameMeta),
                };
            }

            case "submitTurn": {
                return {
                    ...state,
                    cards: action.cards,
                    soloMeta: state.soloMeta
                        ? { ...state.soloMeta, movesTaken: state.soloMeta.movesTaken + action.movesTakenInc, timeElapsed: action.timeElapsed }
                        : null,
                    multiplayerMeta: state.multiplayerMeta
                        ? {
                            ...state.multiplayerMeta,
                            currentPlayerID: action.nextPlayerId !== null ? action.nextPlayerId : state.multiplayerMeta.currentPlayerID,
                            players: state.multiplayerMeta.players.map((player) =>
                                player.id === action.scoreIncPlayerId ? { ...player, score: player.score + 1 } : player
                            )
                        }
                        : null,
                };
            }

            case "submitTimeUpdate": {
                if (!state.soloMeta) return state;
                return { ...state, soloMeta: { ...state.soloMeta, timeElapsed: action.timeElapsed } };
            }

            default:
                throw new Error("unknown action type");
        }
    }

    const [gameState, dispatch] = useReducer(reducer, {
        gameMeta: {
            theme: "numbers",
            playerCount: 1,
            gridSize: 4,
        },
        soloMeta: null,
        multiplayerMeta: null,
        cards: [],
    });

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