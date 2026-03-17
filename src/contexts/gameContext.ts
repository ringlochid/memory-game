import { createContext } from "react";
import type { GameAction } from "../components/gameProvider";

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
}

export interface MultiplayerMeta {
  players: PlayerMeta[];
  currentPlayerID: number;
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
  soloMeta: SoloMeta | null;
  multiplayerMeta: MultiplayerMeta | null;
  cards: CardMeta[];
}

export interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextType | null>(null);
