import type { CardMeta, GameContextType, GameMeta, GameState, MultiplayerMeta, SoloMeta } from "../contexts/gameContext";
import { useReducer } from "react";
import { GameContext } from "../contexts/gameContext";

export interface SubmitGameFormProps {
    type: "submitGameForm";
    gameMeta: GameMeta;
}

export interface SubmitGameResultProps {
    type: "submitGameResult";
    gameType: "solo" | "multiplayer";
    soloMeta: SoloMeta | null;
    multiplayerMeta: MultiplayerMeta | null;
}

export interface SubmitCardProps {
    type: "submitCard";
    cards: CardMeta[];
}

export type GameAction = SubmitGameFormProps | SubmitGameResultProps | SubmitCardProps;

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const reducer = (state: GameState, action: GameAction) => {
        switch (action.type) {
            case "submitGameForm":
                return { ...state, gameMeta: action.gameMeta };
            case "submitGameResult":
                if (action.gameType === "solo") {
                    return { ...state, soloMeta: action.soloMeta };
                } else {
                    return { ...state, multiplayerMeta: action.multiplayerMeta };
                }
            case "submitCard":
                return { ...state, cards: action.cards };
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
