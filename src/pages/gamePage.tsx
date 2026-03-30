import { useCallback, useEffect, useState, type JSX } from "react";
import { GameBoardContainer } from "../components/gameGridContainer";
import { GameFooterContainer } from "../components/gameFooterContainer";
import { GameHeaderContainer } from "../components/gameHeaderContainer";
import { useGameLogic } from "../hooks/useGameLogic";
import { useNavigate } from "react-router";
import { useGame } from "../contexts/useGame";
import { ResultContainer } from "../components/gameResultModal";
import { MenuContainer } from "../components/gameMenuModal";

export function GamePage(): JSX.Element {
    const { gameState } = useGame();
    const { cards } = gameState;
    const { handleCardClick, timeElapsed, isGameOver, handleRestart, handleSetupNewGame } = useGameLogic();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (cards.length === 0) {
            navigate("/");
        }
    }, [cards, navigate]);

    const handleOpenMenu = useCallback(() => {
        setIsMenuOpen(true);
    }, [setIsMenuOpen]);

    const handleCloseMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, [setIsMenuOpen]);

    return (
        <div className="flex flex-col items-center justify-between h-screen p-6">
            <GameHeaderContainer handleOpenMenu={handleOpenMenu} handleRestart={handleRestart} handleSetupNewGame={handleSetupNewGame} />
            {isMenuOpen && <MenuContainer handleRestart={() => { handleRestart(); handleCloseMenu(); }} handleSetupNewGame={() => { handleSetupNewGame(); handleCloseMenu(); }} handleResume={handleCloseMenu} />}

            <GameBoardContainer handleCardClick={handleCardClick} />

            <GameFooterContainer timeElapsed={timeElapsed} />
            {isGameOver && <ResultContainer timeElapsed={timeElapsed} handleRestart={handleRestart} handleSetupNewGame={handleSetupNewGame} />}
        </div>
    )
}