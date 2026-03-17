import type { JSX } from "react"

export function GameMenuBtn({ handleOpenMenu }: { handleOpenMenu: () => void }): JSX.Element {
    return (
        <button className="h-8 w-19 rounded-2xl bg-orange-400 cursor-pointer flex justify-center items-center" onClick={handleOpenMenu}>
            <span className="text-preset-14">
                Menu
            </span>
        </button>
    )
}

export function GameHeaderContainer({ handleOpenMenu, handleRestart, handleSetupNewGame }: { handleOpenMenu: () => void, handleRestart: () => void, handleSetupNewGame: () => void }): JSX.Element {
    return (
        <header className="w-full flex pb-10 md:pb-20 justify-between items-center max-w-163.5 lg:max-w-277.5 mx-auto">
            <h1 className="text-[24px] md:text-preset-4 text-blue-950 font-bold tracking-tight">
                memory
            </h1>
            
            {/* Mobile Menu Button */}
            <div className="block md:hidden">
                <GameMenuBtn handleOpenMenu={handleOpenMenu} />
            </div>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex gap-4">
                <button 
                  onClick={handleRestart}
                  className="w-31.75 h-13 rounded-[26px] bg-orange-400 hover:btn-hover-preset-1 text-grey-50 text-[20px] font-bold cursor-pointer transition-colors"
                >
                    Restart
                </button>
                <button 
                  onClick={handleSetupNewGame}
                  className="w-37.25 h-13 rounded-[26px] bg-blue-100 hover:btn-hover-preset-2 text-blue-800 text-[20px] font-bold cursor-pointer transition-colors"
                >
                    New Game
                </button>
            </div>
        </header>
    )
}