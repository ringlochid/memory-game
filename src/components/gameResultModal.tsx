import type { JSX } from "react"
import { useGame } from "../contexts/useGame";


export function ResultItem({ name, value, isHighlighted }: { name: string, value: string, isHighlighted: boolean }): JSX.Element {
    const bgClass = isHighlighted ? "bg-blue-950" : "bg-blue-100";
    const textClassName = isHighlighted ? "text-grey-100" : "text-blue-400";
    const textClassValue = isHighlighted ? "text-grey-100" : "text-blue-800";

    return (
        <div className={`w-full h-12 flex p-4 justify-between ${bgClass} rounded-[0.3125rem]`}>
            <h2 className={`text-preset-19 ${textClassName}`}>{name}</h2>
            <p className={`text-preset-20 ${textClassValue}`}>{value}</p>
        </div>
    )
}

export function ResultBtn({ text, isHighlighted, handleClick }: { text: string, isHighlighted: boolean, handleClick: () => void }): JSX.Element {
    const bgClass = isHighlighted ? "bg-orange-400" : "bg-blue-100";
    const textClass = isHighlighted ? "text-grey-50" : "text-blue-800";
    const hoverClass = isHighlighted ? "hover:btn-hover-preset-1" : "hover:btn-hover-preset-2";
    return (
        <button className={`flex justify-center items-center w-full h-12 rounded-[1.625rem] transition-colors duration-150 ${bgClass} ${hoverClass} ${textClass} text-preset-9`} onClick={handleClick}>{text}</button>
    )
}

export function ResultContainer({ handleRestart, handleSetupNewGame }: { handleRestart: () => void, handleSetupNewGame: () => void }): JSX.Element {
    const { gameState } = useGame();
    const { soloMeta, multiplayerMeta } = gameState;

    if (soloMeta) {
        const minutes = Math.floor(soloMeta.timeElapsed / 60);
        const seconds = soloMeta.timeElapsed % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
                <div className="z-100 w-81.75 flex flex-col bg-white p-6 gap-6 rounded-[0.625rem]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-preset-21">you did it</h1>
                        <p className="text-preset-22">Game over! Here’s how you got on…</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <ResultItem name="time elapsed" value={`${formattedMinutes}:${formattedSeconds}`} isHighlighted={false} />
                        <ResultItem name="moves taken" value={soloMeta.movesTaken.toString()} isHighlighted={false} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <ResultBtn text="Restart" isHighlighted={true} handleClick={handleRestart} />
                        <ResultBtn text="Setup New Game" isHighlighted={false} handleClick={handleSetupNewGame} />
                    </div>
                </div>
            </div>
        )
    }
    if (multiplayerMeta) {
        const rankedPlayers = multiplayerMeta.players.sort((a, b) => b.score - a.score);
        const highestScore = rankedPlayers[0].score;
        const winningPlayer = rankedPlayers.filter(player => player.score === highestScore);
        return (
            <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
                <div className="z-100 w-81.75 flex flex-col bg-white p-6 gap-6 rounded-[0.625rem]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-preset-21">{winningPlayer.length > 1 ? "It's a tie!" : `Player ${winningPlayer[0].id + 1} Wins!`}</h1>
                        <p className="text-preset-22">Game over! Here are the results…</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        {rankedPlayers.map((player) => (
                            <ResultItem key={player.id} name={`Player ${player.id + 1} ${player.score === highestScore ? "(Winner)" : ""}`} value={player.score.toString()} isHighlighted={player.score === highestScore} />
                        ))}
                    </div>
                    <div className="flex flex-col gap-4">
                        <ResultBtn text="Restart" isHighlighted={true} handleClick={handleRestart} />
                        <ResultBtn text="Setup New Game" isHighlighted={false} handleClick={handleSetupNewGame} />
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div>
            <h1>Unknown game mode</h1>
        </div>
    )
}