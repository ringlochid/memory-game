import { useGameLogic } from "../hooks/useGameLogic";
import { useGame } from "../contexts/useGame";
import type { CardMeta } from "../contexts/gameContext";
import type { JSX } from "react";

const GridSizeClass: Record<number, string> = {
    6: "grid grid-cols-6",
    4: "grid grid-cols-4",
}


export function GameCard({ card, handleClick }: { card: CardMeta, handleClick: (id: number) => void }): JSX.Element {

    let bgClass = "bg-blue-800 hover:bg-blue-350";
    let contentOpacity = "opacity-0";

    if (card.isFlipped && !card.isMatched) {
        bgClass = "bg-orange-400";
        contentOpacity = "opacity-100";
    } else if (card.isMatched) {
        bgClass = "bg-blue-300";
        contentOpacity = "opacity-100";
    }

    return (
        <button
            id={`game-btn-${card.id}`}
            className={`w-full aspect-square rounded-full flex items-center justify-center transition-colors duration-200 ${bgClass}`}
            onClick={() => handleClick(card.id)}
            disabled={card.isMatched}
            aria-label={`Card ${card.id}, ${card.isFlipped || card.isMatched ? `showing ${card.value}` : 'face down'}`}
            aria-pressed={card.isFlipped || card.isMatched}
        >
            <div className={`transition-opacity duration-200 ${contentOpacity}`}>
                {card.theme === 'numbers' ? (
                    <span className="text-preset-8 md:text-preset-3 text-grey-50">
                        {card.value}
                    </span>
                ) : (
                    <div
                        className={`w-6 h-6 md:w-10 md:h-10 icon-mask ${card.isFlipped && !card.isMatched ? 'bg-grey-50' : 'bg-grey-50'}`}
                        style={{ '--icon-url': `url("${card.value}")` } as React.CSSProperties}
                    />
                )}
            </div>
        </button>
    )
}


export function GameBoardContainer(): JSX.Element {
    const { gameState } = useGame();
    const { gameMeta, cards } = gameState;
    const { gridSize } = gameMeta;

    const { handleCardClick } = useGameLogic();

    return (
        <div className={`${GridSizeClass[gridSize]} gap-3 md:gap-4 w-full justify-start items-start max-w-[532px] mx-auto`}>
            {cards.map((card) => (
                <GameCard key={card.id} card={card} handleClick={handleCardClick} />
            ))}
        </div>
    )
}