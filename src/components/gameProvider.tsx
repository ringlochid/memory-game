import type { CardMeta, GameContextType, GameMeta, GameState, MultiplayerMeta, SoloMeta } from "../contexts/gameContext";
import { useReducer } from "react";
import { GameContext } from "../contexts/gameContext";
import { getRandomIcons } from "../utils/icons";

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

            case "submitGameForm": {
                const totalCards = action.gameMeta.gridSize * action.gameMeta.gridSize;
                const pairsNeeded = totalCards / 2;

                let symbols: string[] = [];
                if (action.gameMeta.theme === "icons") {
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
                    theme: action.gameMeta.theme,
                    value: value,
                    isFlipped: false,
                    isMatched: false,
                }));

                console.log(initialCards);

                return {
                    gameMeta: action.gameMeta,
                    soloMeta: null,
                    multiplayerMeta: null,
                    cards: initialCards,
                };
            }

            case "submitCard":
                return { ...state, cards: action.cards };

            case "submitGameResult":
                if (action.gameType === "solo") {
                    return { ...state, soloMeta: action.soloMeta };
                } else {
                    return { ...state, multiplayerMeta: action.multiplayerMeta };
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
