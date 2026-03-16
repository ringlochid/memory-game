import type { CardMeta, GameContextType, GameMeta, GameState, MultiplayerMeta, SoloMeta, PlayerMeta } from "../contexts/gameContext";
import { useReducer } from "react";
import { GameContext } from "../contexts/gameContext";
import { getRandomIcons } from "../utils/icons";

export interface SubmitGameFormProps {
    type: "submitGameForm";
    gameMeta: GameMeta;
}

export interface SubmitCardProps {
    type: "submitCard";
    cards: CardMeta[];
}

export interface SubmitMoveProps {
    type: "submitMove";
    gameType: "solo" | "multiplayer";
    playerId: number | null;
}

export interface SubmitCurrentPlayerIDChangeProps {
    type: "submitCurrentPlayerIDChange";
    currentPlayerID: number;
}

export interface SubmitScoreUpdateProps {
    type: "submitScoreUpdate";
    playerId: number;
}

export type GameAction = SubmitGameFormProps | SubmitCardProps | SubmitMoveProps | SubmitCurrentPlayerIDChangeProps | SubmitScoreUpdateProps;

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
            rank: 1,
            moves: 0,
        });
    }
    return {
        players,
        maxScore: 0,
        currentPlayerID: 0,
    };
}


export const GameProvider = ({ children }: { children: React.ReactNode }) => {

    const reducer = (state: GameState, action: GameAction) => {
        switch (action.type) {

            case "submitGameForm": {
                return {
                    gameMeta: action.gameMeta,
                    soloMeta: action.gameMeta.playerCount === 1 ? initializeSoloMeta() : null,
                    multiplayerMeta: action.gameMeta.playerCount > 1 ? initializeMultiplayerMeta(action.gameMeta) : null,
                    cards: initializeCards(action.gameMeta),
                };
            }

            case "submitCard":
                return { ...state, cards: action.cards };

            case "submitMove": {
                if (action.gameType === "solo") {
                    if (!state.soloMeta) return state;
                    return { ...state, soloMeta: { ...state.soloMeta, movesTaken: state.soloMeta.movesTaken + 1 } };
                } else {
                    if (!state.multiplayerMeta) return state;
                    return { ...state, multiplayerMeta: { ...state.multiplayerMeta, players: state.multiplayerMeta.players.map((player) => player.id === action.playerId ? { ...player, moves: player.moves + 1 } : player) } };
                }
            }

            case "submitCurrentPlayerIDChange": {
                if (!state.multiplayerMeta) return state;
                return { ...state, multiplayerMeta: { ...state.multiplayerMeta, currentPlayerID: action.currentPlayerID } };
            }

            case "submitScoreUpdate": {
                if (!state.multiplayerMeta) return state;
                return { ...state, multiplayerMeta: { ...state.multiplayerMeta, players: state.multiplayerMeta.players.map((player) => player.id === action.playerId ? { ...player, score: player.score + 1 } : player) } };
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

