import { GameBoardContainer } from "../components/gameGridContainer";
import { GameFooterContainer } from "../components/gameFooterContainer";
import { GameHeaderContainer } from "../components/gameHeaderContainer";

export function GamePage() {
    return (
        <div className="flex flex-col items-center justify-between h-screen p-6">
            <GameHeaderContainer />
            <GameBoardContainer boardSize="six" />
            <GameFooterContainer />
        </div>
    )
}