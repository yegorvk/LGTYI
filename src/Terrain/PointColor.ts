
export function colorRGBFromAltitude(alt: number, smooth: boolean = false, maxAlt: number = 50): number {
    const alts = [
        0,
        0.6*maxAlt,
        0.7*maxAlt,
        maxAlt
    ]

    const colors = [
        0x004225,
        0xAAFF00,
        0xFF0000,
        0x231709
    ]

    if (smooth) {
        for (let i = 1; i < 4; i++) {
            if (alt <= alts[i]) {
                const a = (alt - alts[i-1]) / (alts[i] - alts[i-1])
                return lerp_color(colors[i-1], colors[i], a)
            }
        }
    } else {
        for (let i = 0; i < 4; i++)
            if (alt <= alts[i])
                return colors[i];
    }
}

export function colorGrayScaleFromAltitude(
    alt: number,
    maxAlt: number = 50,
    minAlt: number = -50
): number {
    return Math.min(255, Math.round((((alt - minAlt) / (maxAlt - minAlt)) * 255)))
}

export function rgbFromGrayScale(grayScale: number): number {
    return (grayScale << 16) + (grayScale << 8) + grayScale
}

function lerp_color(y1: number, y2: number, a: number): number {
    const r1 = (y1 >> 16) & 0xFF;
    const g1 = (y1 >> 8) & 0xFF;
    const b1 = y1 & 0xFF;

    const r2 = (y2 >> 16) & 0xFF;
    const g2 = (y2 >> 8) & 0xFF;
    const b2 = y2 & 0xFF;
    
    const r = lerp(r1, r2, a);
    const g = lerp(g1, g2, a);
    const b = lerp(b1, b2, a);

    return (r << 16) + (g << 8) + b;
}

function lerp(v1: number, v2: number, a: number): number {
    return a*v2+v1*(1-a);
}