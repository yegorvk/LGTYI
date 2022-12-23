

export function colorRGBFromAltitude(
    alt: number,
    waterLevel: number,
    useWaterColors: boolean = true,
    maxAlt: number = 50,
    minAlt: number = -50
): number {
    // get rid of negative values
    maxAlt -= minAlt;
    alt -= minAlt;
    waterLevel -= minAlt;

    maxAlt = Math.max(0, maxAlt)
    alt = Math.max(0, alt)
    waterLevel = Math.max(0, waterLevel)

    const landAlts = [
        0,
        0.4*maxAlt,
        0.7*maxAlt,
        0.9*maxAlt,
        maxAlt
    ]

    const landColors = [
        0x004225,
        0x3CB043,
        0xAAFF00,
        0xFF0000,
        0x231709
    ]

    const waterColors = [
        0x0A1172,
        0x016064,
        0x13388E,
        0x3944BC
    ]

    const waterColor = 0x3944BC

    const waterAlts = [
        0.1,
        0.2,
        0.6,
        1.0,
    ]

    let j = 0;

    while (j < landAlts.length && landAlts[j] < waterLevel)
        j++;

    if (j == landAlts.length) j--;

    if (useWaterColors && alt <= waterLevel) {
        if (waterLevel > landAlts[j])
            return waterColor;
        else {
            const altRel = alt / waterLevel

            for (let i = 1; i < waterAlts.length; i++) {
                if (altRel <= waterAlts[i]) {
                    const a = 
                        (altRel - waterAlts[i-1]) / 
                        (waterAlts[i] - waterAlts[i-1])

                    return lerp_color(waterColors[i-1], waterColors[i], a)
                }
            } 

            return waterColor;
        }
    }

    for (let i = 1; i < landColors.length; i++) {
        if (alt <= landAlts[i]) {
            const a = (alt - landAlts[i-1]) / (landAlts[i] - landAlts[i-1])
            return lerp_color(landColors[i-1], landColors[i], a)
        }
    }
}

export function colorGrayScaleFromAltitude(
    alt: number,
    maxAlt: number = 50,
    minAlt: number = -50
): number {
    return Math.min(255, Math.round((((alt - minAlt) / (maxAlt - minAlt)) * 255)))
}

/** @argument grayscale grayscale value (from 0 to 255) */
export function altitudeFromGrayscale(
    grayscale: number,
    maxAlt: number = 50,
    minAlt: number = -50
) {
    const altRel = (grayscale / 255) * (maxAlt - minAlt)
    return minAlt + altRel;
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