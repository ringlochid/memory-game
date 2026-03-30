import { createContext } from "react";
import type { GameAction } from "../components/gameProvider";

export type Theme = "numbers" | "icons";

export type GridSize = 4 | 6;

export interface GameMeta {
  theme: Theme;
  playerCount: number;
  gridSize: GridSize;
}

export const DEFAULT_GAME_META: GameMeta = {
  theme: "numbers",
  playerCount: 1,
  gridSize: 4,
};

export interface SoloMeta {
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
  selectedCardIds: number[];
  isResolving: boolean;
}

export interface GameContextType {
  gameState: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextType | null>(null);
