import type { JSX } from "react"
import { useGame } from "../contexts/useGame";

export function FooterSection({ name, shortName, value, isHighlighted, isMultiplayer = false }: { name: string, shortName?: string, value: string, isHighlighted: boolean, isMultiplayer?: boolean }): JSX.Element {
    const bgClass = isHighlighted ? "bg-orange-400" : "bg-blue-100";
    const textNameColor = isHighlighted ? "text-grey-50" : "text-blue-400";
    const textValueColor = isHighlighted ? "text-grey-50" : "text-blue-800";

    return (
        <div className={`relative h-17.5 md:h-900 w-full ${bgClass} rounded-xl md:px-5 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between transition-colors duration-200`}>
            {/* Active triangle indicator for multiplayer */}
            {isMultiplayer && isHighlighted && (
                <svg className="absolute -top-2 lg:-top-5 left-1/2 -translate-x-1/2 w-4 h-2 lg:w-9.75 lg:h-5 text-orange-400 fill-current" viewBox="0 0 16 8" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0 8L8 0L16 8H0Z"/>
                </svg>
            )}

            <p className={`text-[15px] md:text-[18px] font-bold ${textNameColor}`}>
                <span className="md:hidden">{shortName || name}</span>
                <span className="hidden md:inline">{name}</span>
            </p>
            <p className={`text-[24px] md:text-[32px] font-bold ${textValueColor}`}>{value}</p>

            {/* Current Turn indicator text below */}
            {isMultiplayer && isHighlighted && (
                <p className="hidden lg:block absolute -bottom-8 left-1/2 -translate-x-1/2 text-[13px] tracking-widest font-bold text-blue-950 uppercase whitespace-nowrap">Current Turn</p>
            )}
        </div>
    )
}

export function GameFooterContainer({ timeElapsed }: { timeElapsed: number }): JSX.Element {
    const { gameState } = useGame();
    const { gameMeta, multiplayerMeta, soloMeta } = gameState;
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    if (gameMeta.playerCount > 1 && multiplayerMeta) {
        return (
            <footer className="w-full flex gap-6 p-6 md:pb-10 max-w-277.5 mx-auto lg:mt-6">
                {multiplayerMeta.players.map((player) => (
                    <FooterSection
                        key={player.id}
                        name={`Player ${player.id + 1}`}
                        shortName={`P${player.id + 1}`}
                        value={player.score.toString()}
                        isHighlighted={multiplayerMeta.currentPlayerID === player.id}
                        isMultiplayer={true}
                    />
                ))}
            </footer>
        )
    }

    if (gameMeta.playerCount === 1 && soloMeta) {
        return (
            <footer className="w-full flex gap-6 p-6 md:pb-10 max-w-135 mx-auto lg:mt-6">
                <FooterSection name="Time" value={`${formattedMinutes}:${formattedSeconds}`} isHighlighted={false} />
                <FooterSection name="Moves" value={soloMeta.movesTaken.toString()} isHighlighted={false} />
            </footer>
        )
    }

    return (
        <></>
    )
}