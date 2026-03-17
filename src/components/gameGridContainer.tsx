import { useGame } from "../contexts/useGame";
import type { CardMeta } from "../contexts/gameContext";
import type { JSX } from "react";

const GridContainerClass: Record<number, string> = {
    4: "grid grid-cols-4 gap-3 md:gap-6 max-w-81.5 md:max-w-136 mx-auto w-full justify-center items-center",
    6: "grid grid-cols-6 gap-2 md:gap-4 max-w-80.5 md:max-w-143 mx-auto w-full justify-center items-center",
}


export function GameCard({ card, handleClick, gridSize }: { card: CardMeta, handleClick: (id: number) => void, gridSize: number }): JSX.Element {

    let bgClass = "bg-blue-800 hover:bg-blue-350";
    let contentOpacity = "opacity-0";

    if (card.isFlipped && !card.isMatched) {
        bgClass = "bg-orange-400";
        contentOpacity = "opacity-100";
    } else if (card.isMatched) {
        bgClass = "bg-blue-300";
        contentOpacity = "opacity-100";
    }

    const sizeClass = gridSize === 4 
        ? "w-18 h-18 md:w-29.5 md:h-29.5" 
        : "w-11.75 h-11.75 md:w-20.5 md:h-20.5";

    const textClass = gridSize === 4
        ? "text-preset-4 md:text-preset-1"
        : "text-preset-7 md:text-preset-3";
    
    const iconSizeClass = gridSize === 4
        ? "w-10 h-10 md:w-16 md:h-16"
        : "w-6 h-6 md:w-10 md:h-10";

    return (
        <button
            id={`game-btn-${card.id}`}
            className={`${sizeClass} rounded-full flex items-center justify-center transition-colors duration-200 ${bgClass}`}
            onClick={() => handleClick(card.id)}
            disabled={card.isMatched}
            aria-label={`Card ${card.id}, ${card.isFlipped || card.isMatched ? `showing ${card.value}` : 'face down'}`}
            aria-pressed={card.isFlipped || card.isMatched}
        >
            <div className={`transition-opacity duration-200 ${contentOpacity}`}>
                {card.theme === 'numbers' ? (
                    <span className={`${textClass} text-grey-50`}>
                        {card.value}
                    </span>
                ) : (
                    <div
                        className={`${iconSizeClass} icon-mask ${card.isFlipped && !card.isMatched ? 'bg-grey-50' : 'bg-grey-50'}`}
                        style={{ '--icon-url': `url("${card.value}")` } as React.CSSProperties}
                    />
                )}
            </div>
        </button>
    )
}


export function GameBoardContainer({ handleCardClick }: { handleCardClick: (id: number) => void }): JSX.Element {
    const { gameState } = useGame();
    const { gameMeta, cards } = gameState;
    const { gridSize } = gameMeta;

    return (
        <div className={GridContainerClass[gridSize]}>
            {cards.map((card) => (
                <GameCard key={card.id} card={card} handleClick={handleCardClick} gridSize={gridSize} />
            ))}
        </div>
    )
}