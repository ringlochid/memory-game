import type { JSX } from "react";

export function MenuBtn({ text }: { text: string }): JSX.Element {
    return (
        <button className="flex justify-center items-center w-full h-12 rounded-[1.625rem] bg-blue-100 hover:bg-orange-400 text-preset-17 hover:text-preset-18">{text}</button>
    )
}

export function MenuContainer(): JSX.Element {
    return (
        <div className="relative h-svh w-svw grid place-items-center">
            <div className="absolute z-100 w-81.75 flex flex-col bg-white p-6 gap-4 rounded-[0.625rem]">
                <MenuBtn text="restart" />
                <MenuBtn text="restart" />
                <MenuBtn text="restart" />
            </div>
        </div>
    )
}