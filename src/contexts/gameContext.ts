import { createContext } from "react";

export type Theme = "numbers" | "icons";

export type GridSize = 4 | 6;

export interface GameMeta {
    theme: Theme;
    playerCount: number;
    gridSize: GridSize;
}

export interface SoloMeta {
    timeElapsed: number;
    movesTaken: number;
}

export interface PlayerMeta {
    id: number;
    score: number;
    rank: number;
    isTurn: boolean;
}

export interface MultiplayerMeta {
    players: PlayerMeta[];
    maxScore: number;
}

export interface CardMeta {
    id: number;
    theme: Theme;
    value: string;
    isFlipped: boolean;
    isMatched: boolean;
}

export interface GameState {
    gameMeta: GameMeta;
    soloMeta: SoloMeta;
    multiplayerMeta: MultiplayerMeta;
    cards: CardMeta[];
}

export interface GameContextType {
    gameState: GameState;
    dispatch: React.Dispatch<React.SetStateAction<GameState>>;
}

export const GameContext = createContext<GameContextType | null>(null)
