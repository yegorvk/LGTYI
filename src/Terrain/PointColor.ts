export function colorRGBFromAltitude(alt: number, maxAlt: number = 50): number {
    if (alt < (200/2400)*maxAlt)
        return 0x00FF00
    else if (alt < (500/2400)*maxAlt)
        return 0xFF0000
    else
        return 0x231709
}

export function colorGrayScaleFromAltitude(alt: number, maxAlt: number = 50): number {
    return Math.min(255, Math.round(((alt / maxAlt) * 255)))
}

export function rgb(r: number, g: number, b: number): number {
    return (r << 16) + (g << 8) + b;
}