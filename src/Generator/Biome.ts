import type { GeneratorOptions } from "../Terrain/GeneratorOptions";
import { alt, distance2 } from "./Util";

export class Biome {
    private centerX: number;
    private centerY: number;
    
    private minAltitude: number;
    private maxAltitude: number;

    constructor(
        centerX: number,
        centerY: number,
        minAltitude: number,
        maxAltitude: number
    ) {
        this.minAltitude = minAltitude;
        this.maxAltitude = maxAltitude;

        this.centerX = centerX;
        this.centerY = centerY;
    }

    height(x: number, y: number, normalizedNoise: number) {
        normalizedNoise = (normalizedNoise + 1.0) / 2.0;
        return this.minAltitude + normalizedNoise * (this.maxAltitude - this.minAltitude);
    }

    strength(x: number, y: number) {
        let d = distance2(x, y, this.centerX, this.centerY);
        return d*d*d*d*d;
    }
}

const MIN_ALT = [
    -1.0,
    -0.6,
    -0.1,
    0.05,
    0.1,
    0.6,
    0.2
];

const MAX_ALT = [
    0.1,
    0.1,
    0.05,
    0.2,
    0.4,
    0.8,
    1.0
];

export const OCEAN = 0;
export const SEA = 1;
export const SWAMP = 2;
export const PLAINS = 3;
export const HILLS = 4;
export const PLATEU = 5;
export const MOUNTAINS = 6;

export const MAX_BIOME_ID = 6;

export function biome(id: number, x: number, y: number, options: GeneratorOptions) {
    return new Biome(x, y, alt(MIN_ALT[id], options), alt(MAX_ALT[id], options));
}