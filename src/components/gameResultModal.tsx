import type { JSX } from "react"

export function ResultItemSolo(): JSX.Element {

    return (
        <div className="w-full h-12 flex p-4 justify-between bg-blue-100 rounded-[0.3125rem]">
            <h2 className="text-preset-19">time elapsed</h2>
            <p className="text-preset-20">1:30</p>
        </div>
    )
}

export function ResultBtn({ text }: { text: string }): JSX.Element {
    return (
        <button className="flex justify-center items-center w-full h-12 rounded-[1.625rem] bg-blue-100 hover:bg-orange-400 text-preset-17 hover:text-preset-18">{text}</button>
    )
}

export function ResultContainer(): JSX.Element {
    return (
        <div className="relative h-svh w-svw grid place-items-center">
            <div className="absolute z-100 w-81.75 flex flex-col bg-white p-6 gap-6 rounded-[0.625rem]">
                <div className="flex flex-col gap-2">
                    <h1 className="text-preset-21">you did it</h1>
                    <p className="text-preset-22">Game over! Here’s how you got on…</p>
                </div>
                <div className="flex flex-col gap-2">
                    <ResultItemSolo />
                    <ResultItemSolo />
                </div>
                <div className="flex flex-col gap-4">
                    <ResultBtn text="menu" />
                    <ResultBtn text="play again" />
                </div>
            </div>
        </div>
    )
}