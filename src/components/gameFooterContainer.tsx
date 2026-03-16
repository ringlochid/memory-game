import type { JSX } from "react"
import { useGame } from "../contexts/useGame";

export function FooterSection({ name, value, isHighlighted }: { name: string, value: string, isHighlighted: boolean }): JSX.Element {
    const bgClass = isHighlighted ? "bg-orange-400" : "bg-blue-300";
    return (
        <div className={`h-17.5 w-full ${bgClass} rounded-[0.3125rem] flex flex-col items-center justify-center gap-0 transition-colors duration-200`}>
            <p className="text-preset-15">{name}</p>
            <p className="text-preset-16">{value}</p>
        </div>
    )
}

export function GameFooterContainer(): JSX.Element {
    const { gameState } = useGame();
    const { gameMeta, multiplayerMeta, soloMeta } = gameState;

    if (gameMeta.playerCount > 1 && multiplayerMeta) {
        return (
            <footer className="w-full flex gap-6 p-6">
                {multiplayerMeta.players.map((player) => (
                    <FooterSection key={player.id} name={`P${player.id + 1}`} value={player.score.toString()} isHighlighted={multiplayerMeta.currentPlayerID === player.id} />
                ))}
            </footer>
        )
    }

    if (gameMeta.playerCount === 1 && soloMeta) {
        return (
            <footer className="w-full flex gap-6 p-6">
                <FooterSection name="Timer" value={soloMeta.timeElapsed.toString()} isHighlighted={false} />
                <FooterSection name="Moves" value={soloMeta.movesTaken.toString()} isHighlighted={false} />
            </footer>
        )
    }

    return (
        <></>
    )
}