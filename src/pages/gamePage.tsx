import type { JSX } from "react";
import { GameBoardContainer } from "../components/gameGridContainer";
import { GameFooterContainer } from "../components/gameFooterContainer";
import { GameHeaderContainer } from "../components/gameHeaderContainer";
import { useGameLogic } from "../hooks/useGameLogic";

export function GamePage(): JSX.Element {
    const { handleCardClick } = useGameLogic();
    return (
        <div className="flex flex-col items-center justify-between h-screen p-6">
            <GameHeaderContainer />
            <GameBoardContainer handleCardClick={handleCardClick} />
            <GameFooterContainer />
        </div>
    )
}