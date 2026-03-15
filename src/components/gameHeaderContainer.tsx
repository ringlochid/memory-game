import type { JSX } from "react"

export function GameMenuBtn(): JSX.Element {
    return (
        <button className="h-8 w-19 rounded-2xl bg-orange-400 cursor-pointer flex justify-center items-center">
            <span className="text-preset-14">
                Menu
            </span>
        </button>
    )
}

export function GameHeaderContainer(): JSX.Element {
    return (
        <header className="self-stretch flex p-6 justify-between items-center">
            <h1 className="text-preset-5">
                memory
            </h1>
            <GameMenuBtn />
        </header>
    )
}