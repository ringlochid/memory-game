import { useEffect, type JSX } from "react";
import { GameBoardContainer } from "../components/gameGridContainer";
import { GameFooterContainer } from "../components/gameFooterContainer";
import { GameHeaderContainer } from "../components/gameHeaderContainer";
import { useGameLogic } from "../hooks/useGameLogic";
import { useNavigate } from "react-router";
import { useGame } from "../contexts/useGame";
import { ResultContainer } from "../components/gameResultModal";

export function GamePage(): JSX.Element {
    const { gameState } = useGame();
    const { cards } = gameState;
    const { handleCardClick, timeElapsed, isGameOver } = useGameLogic();
    const navigate = useNavigate();

    useEffect(() => {
        if (cards.length === 0) {
            navigate("/");
        }
    }, [cards, navigate]);

    return (
        <div className="flex flex-col items-center justify-between h-screen p-6">
            <GameHeaderContainer />
            <GameBoardContainer handleCardClick={handleCardClick} />
            <GameFooterContainer timeElapsed={timeElapsed} />
            {isGameOver && <ResultContainer />}
        </div>
    )
}