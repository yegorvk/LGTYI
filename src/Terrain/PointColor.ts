import { lerp } from "../math";
import { MAX_ALT, MIN_ALT } from "../Generator/GeneratorOptions";

const DEFAULT_LAND_COLORS = [
    0x004225,
    0x3CB043,
    0xAAFF00,
    0xFF0000,
    0xFFFFFF,
    0xFFFFFF
];

const DEFAULT_WATER_COLORS = [
    0x04124f,
    0x061c7d,
    0x09259e,
    0x0c2fc7
];

const DEFAULT_LAND_ALTS = [
    0,
    0.4,
    0.7,
    0.9,
    0.95,
    1.0
];

const DEFAULT_WATER_ALTS = [
    0.1,
    0.2,
    0.6,
    1.0,
];

/**
 * Terrain height gradient description.
 * 
 * `landColors.length` must be the same as `landAlts.length`
 * 
 * `waterColors.length` must be the same as `waterAlts.length`
 * 
 * @property landColors key colors for interpolation at different height values
 * @property landAlts corresponding height values for `landColors` (from 0 to 1)
 * @property waterColors key colors for interpolation of water surface at different depth values
 * @property waterAlts corresponding depth values for `waterColors` (from 0 to 1)
 * 
 */
export interface GradientSettings {
    landColors: Array<number>,
    landAlts: Array<number>,
    waterColors: Array<number>,
    waterAlts: Array<number>
}

export const DefaultGradientSettings: GradientSettings = {
    landColors: DEFAULT_LAND_COLORS,
    landAlts: DEFAULT_LAND_ALTS,
    waterColors: DEFAULT_WATER_COLORS,
    waterAlts: DEFAULT_WATER_ALTS
}

export function colorRGBFromAltitude(
    alt: number,
    waterLevel: number,
    useWaterColors: boolean = true,
    gradientSettings: GradientSettings = DefaultGradientSettings,
    maxAlt: number = MAX_ALT,
    minAlt: number = MIN_ALT
): number {
    // get rid of negative values
    maxAlt -= minAlt;
    alt -= minAlt;
    waterLevel -= minAlt;

    maxAlt = Math.max(0, maxAlt)
    alt = Math.max(0, Math.min(alt, maxAlt))
    waterLevel = Math.max(0, waterLevel)

    alt /= maxAlt;
    waterLevel /= maxAlt;

    const waterColor = 0x3944BC

    let j = 0;

    while (j < gradientSettings.landAlts.length && gradientSettings.landAlts[j] < waterLevel)
        j++;

    if (j == gradientSettings.landAlts.length) j--;

    if (useWaterColors && alt <= waterLevel) {
        if (waterLevel > gradientSettings.landAlts[j])
            return waterColor;
        else {
            const altRel = alt / waterLevel

            for (let i = 1; i < gradientSettings.waterAlts.length; i++) {
                if (altRel <= gradientSettings.waterAlts[i]) {
                    const a = 
                        (altRel - gradientSettings.waterAlts[i-1]) / 
                        (gradientSettings.waterAlts[i] - gradientSettings.waterAlts[i-1])

                    return lerp_color(gradientSettings.waterColors[i-1], gradientSettings.waterColors[i], a)
                }
            } 

            return waterColor;
        }
    }

    for (let i = 1; i < gradientSettings.landColors.length; i++) {
        if (alt <= gradientSettings.landAlts[i]) {
            const a = (alt - gradientSettings.landAlts[i-1]) / (gradientSettings.landAlts[i] - gradientSettings.landAlts[i-1])
            return lerp_color(gradientSettings.landColors[i-1], gradientSettings.landColors[i], a)
        }
    }
}

export function colorGrayScaleFromAltitude(
    alt: number,
    maxAlt: number = MAX_ALT,
    minAlt: number = MIN_ALT
): number {
    return Math.min(255, Math.round((((alt - minAlt) / (maxAlt - minAlt)) * 255)))
}

/** @argument grayscale grayscale value (from 0 to 255) */
export function altitudeFromGrayscale(
    grayscale: number,
    maxAlt: number = MAX_ALT,
    minAlt: number = MIN_ALT
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