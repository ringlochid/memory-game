import type { JSX } from "react";

const GridSizeClass: Record<string, string> = {
    six: "grid grid-cols-6",
    four: "grid grid-cols-4",
}


export function GameBtn({ id, isNumber }: { id: number, isNumber: boolean; }): JSX.Element {
    return (
        <button id={`game-btn-${id}`} title="game button" className="w-full aspect-square bg-blue-800 rounded-full" />
    )
}

export function GameBoardContainer({ boardSize }: { boardSize: string; }): JSX.Element {
    const size = boardSize === 'six' ? 6 : 4;

    return (
        <div className={`${GridSizeClass[boardSize]} gap-3 w-full p-6 justify-start items-start`}>
            {Array.from({ length: size * size }).map((_, idx) => (
                <GameBtn key={idx} id={idx} isNumber={true} />
            ))}
        </div>
    )
}