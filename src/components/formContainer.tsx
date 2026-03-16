import { useState, type JSX, type ReactNode } from "react";
import { useGame } from "../contexts/useGame";
import type { GameMeta } from "../contexts/gameContext";
import { useNavigate } from "react-router";

interface RadioOption {
    id: string;
    value: string | number;
    label: string;
}

function RadioGroup({
    name,
    options,
    currentValue,
    handleChange,
}: {
    name: string;
    options: RadioOption[];
    currentValue?: string | number;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}): JSX.Element {
    return (
        <div className="flex gap-2.75 md:gap-300">
            {options.map((option) => (
                <div key={option.id} className="flex-1">
                    <input
                        id={option.id}
                        type="radio"
                        name={name}
                        value={option.value}
                        checked={option.value === currentValue}
                        className="peer sr-only"
                        onChange={handleChange}
                    />
                    <label
                        htmlFor={option.id}
                        className="flex items-center justify-center h-500 md:h-[52px] rounded-full bg-blue-300 hover:bg-blue-350 peer-checked:bg-blue-800 text-preset-11 md:text-preset-6 text-grey-50 text-center whitespace-nowrap cursor-pointer transition-colors duration-150"
                    >
                        {option.label}
                    </label>
                </div>
            ))}
        </div>
    );
}

function FormSection({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}): JSX.Element {
    return (
        <div className="flex flex-col gap-200">
            <h2 className="text-preset-11 md:text-preset-8 text-blue-400">
                {label}
            </h2>
            {children}
        </div>
    );
}

export function FormContainer(): JSX.Element {
    const { gameState, dispatch } = useGame();
    const [gameSettings, setGameSettings] = useState<GameMeta>({
        theme: gameState.gameMeta.theme,
        playerCount: gameState.gameMeta.playerCount,
        gridSize: gameState.gameMeta.gridSize,
    });
    const navigate = useNavigate();
    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameSettings({ ...gameSettings, theme: e.target.value as "numbers" | "icons" });
    };
    const handlePlayerCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameSettings({ ...gameSettings, playerCount: Number(e.target.value) });
    };
    const handleGridSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGameSettings({ ...gameSettings, gridSize: Number(e.target.value) });
    };
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        dispatch({ type: "submitGameForm", gameMeta: gameSettings });
        navigate("/game");
    };
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-blue-950 p-300">
            <h1 className="text-preset-5 md:text-preset-4 text-grey-50 mb-600 md:mb-1000">
                memory
            </h1>
            <form onSubmit={handleSubmit} className="bg-grey-50 rounded-[10px] md:rounded-[20px] p-300 md:p-700 w-[327px] md:w-[654px] max-w-full flex flex-col gap-300 md:gap-400">
                <FormSection label="Select Theme">
                    <RadioGroup
                        name="theme"
                        options={[
                            { id: "theme-numbers", value: "numbers", label: "Numbers" },
                            { id: "theme-icons", value: "icons", label: "Icons" },
                        ]}
                        currentValue={gameSettings.theme}
                        handleChange={handleThemeChange}
                    />
                </FormSection>

                <FormSection label="Numbers of Players">
                    <RadioGroup
                        name="players"
                        options={[
                            { id: "players-1", value: 1, label: "1" },
                            { id: "players-2", value: 2, label: "2" },
                            { id: "players-3", value: 3, label: "3" },
                            { id: "players-4", value: 4, label: "4" },
                        ]}
                        currentValue={gameSettings.playerCount}
                        handleChange={handlePlayerCountChange}
                    />
                </FormSection>

                <FormSection label="Grid Size">
                    <RadioGroup
                        name="grid"
                        options={[
                            { id: "grid-4x4", value: 4, label: "4x4" },
                            { id: "grid-6x6", value: 6, label: "6x6" },
                        ]}
                        currentValue={gameSettings.gridSize}
                        handleChange={handleGridSizeChange}
                    />
                </FormSection>

                <button
                    type="submit"
                    className="border-0 outline-none appearance-none box-border flex items-center justify-center w-full h-600 md:h-[70px] rounded-full bg-orange-400 hover:bg-orange-300 text-preset-9 md:text-preset-5 text-grey-50 text-center cursor-pointer transition-colors duration-150"
                >
                    Start Game
                </button>
            </form>
        </main>
    );
}
