const iconsRecord = import.meta.glob('../assets/icons/*.svg', {
    eager: true,
    query: '?url',
    import: 'default',
});

export const AVAILABLE_ICONS: string[] = Object.values(iconsRecord) as string[];

export function getRandomIcons(count: number): string[] {
    const safeCount = Math.min(count, AVAILABLE_ICONS.length);
    const shuffledIcons = [...AVAILABLE_ICONS];
    for (let i = shuffledIcons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledIcons[i], shuffledIcons[j]] = [shuffledIcons[j], shuffledIcons[i]];
    }
    return shuffledIcons.slice(0, safeCount);
}
