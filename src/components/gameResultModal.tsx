import type { JSX } from "react"
import { useGame } from "../contexts/useGame";


export function ResultItem({ name, value, isHighlighted }: { name: string, value: string, isHighlighted: boolean }): JSX.Element {
    const bgClass = isHighlighted ? "bg-blue-950" : "bg-blue-100";
    return (
        <div className={`w-full h-12 flex p-4 justify-between ${bgClass} rounded-[0.3125rem]`}>
            <h2 className="text-preset-19">{name}</h2>
            <p className="text-preset-20">{value}</p>
        </div>
    )
}

export function ResultBtn({ text }: { text: string }): JSX.Element {
    return (
        <button className="flex justify-center items-center w-full h-12 rounded-[1.625rem] bg-blue-100 hover:bg-orange-400 text-preset-17 hover:text-preset-18">{text}</button>
    )
}

export function ResultContainer(): JSX.Element {
    const { gameState } = useGame();
    const { soloMeta, multiplayerMeta } = gameState;

    if (soloMeta) {
        const minutes = Math.floor(soloMeta.timeElapsed / 60);
        const seconds = soloMeta.timeElapsed % 60;

        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(seconds).padStart(2, '0');
        return (
            <div className="relative h-svh w-svw grid place-items-center">
                <div className="absolute z-100 w-81.75 flex flex-col bg-white p-6 gap-6 rounded-[0.625rem]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-preset-21">you did it</h1>
                        <p className="text-preset-22">Game over! Here’s how you got on…</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <ResultItem name="time elapsed" value={`${formattedMinutes}:${formattedSeconds}`} isHighlighted={false} />
                        <ResultItem name="moves taken" value={soloMeta.movesTaken.toString()} isHighlighted={false} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <ResultBtn text="menu" />
                        <ResultBtn text="play again" />
                    </div>
                </div>
            </div>
        )
    }
    if (multiplayerMeta) {
        return (
            <div className="relative h-svh w-svw grid place-items-center">
                <div className="absolute z-100 w-81.75 flex flex-col bg-white p-6 gap-6 rounded-[0.625rem]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-preset-21">you did it</h1>
                        <p className="text-preset-22">Game over! Here’s how you got on…</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <ResultItem name="time elapsed" value="1:30" isHighlighted={false} />
                        <ResultItem name="moves taken" value="12" isHighlighted={true} />
                    </div>
                    <div className="flex flex-col gap-4">
                        <ResultBtn text="menu" />
                        <ResultBtn text="play again" />
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