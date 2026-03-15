import type { JSX } from "react"

export function FooterSection({ type, name }: { type: string, name: string }): JSX.Element {
    return (
        <div className="h-17.5 w-full bg-blue-100 rounded-[0.3125rem] flex flex-col items-center justify-center gap-0">
            <p className="text-preset-15">{name}</p>
            <p className="text-preset-16">{type}</p>
        </div>
    )
}

export function GameFooterContainer(): JSX.Element {
    return (
        <footer className="w-full flex gap-6 p-6">
            <FooterSection type="0" name="Score" />
            <FooterSection type="0:01" name="Timer" />
        </footer>
    )
}