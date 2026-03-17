import type { JSX } from "react";

export function MenuBtn({ text, isHighlighted, handleClick }: { text: string, isHighlighted: boolean, handleClick: () => void }): JSX.Element {
    const bgClass = isHighlighted ? "bg-orange-400" : "bg-blue-100";
    const textClass = isHighlighted ? "text-grey-50" : "text-blue-800";
    return (
        <button className={`flex justify-center items-center w-full h-12 rounded-[1.625rem] ${bgClass} hover:btn-hover-preset-1 ${textClass} text-preset-9`} onClick={handleClick}>{text}</button>
    )
}

export function MenuContainer({ handleRestart, handleSetupNewGame, handleResume }: { handleRestart: () => void, handleSetupNewGame: () => void, handleResume: () => void }): JSX.Element {
    return (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
            <div className="absolute z-100 w-81.75 flex flex-col bg-white p-6 gap-4 rounded-[0.625rem]">
                <MenuBtn text="Restart" isHighlighted={true} handleClick={handleRestart} />
                <MenuBtn text="New Game" isHighlighted={false} handleClick={handleSetupNewGame} />
                <MenuBtn text="Resume" isHighlighted={false} handleClick={handleResume} />
            </div>
        </div>
    )
}