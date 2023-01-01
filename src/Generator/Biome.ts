import type { GeneratorOptions } from "./GeneratorOptions";
import { alt, distance2 } from "./Util";

export interface BiomesDistribution {
    oceanChance: number;
    seaChance: number;
    swampChance: number;
    plainsChance: number;
    hillsChance: number;
    plateuChance: number;
    mountainsChance: number;
    lakeChance: number;
    oceanMountainsChance: number;
}

export const DefaultBiomesDistribution: BiomesDistribution = {
    oceanChance: 0.08,
    oceanMountainsChance: 0.05,
    seaChance: 0.1,
    lakeChance: 0.2,
    swampChance: 0.3,
    plainsChance: 0.7,
    hillsChance: 0.4,
    plateuChance: 0.2,
    mountainsChance: 0.3,
};

export function normalizeBiomesDistribution(dist: BiomesDistribution): Array<number> {
    const chances = [
        dist.oceanChance,
        dist.oceanMountainsChance,
        dist.seaChance,
        dist.lakeChance,
        dist.swampChance,
        dist.plainsChance,
        dist.hillsChance,
        dist.plateuChance,
        dist.mountainsChance,
    ];

    const total = chances.reduce((acc, chance) => acc + chance);
    return chances.map(value => value / total);
}

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

    height(normalizedNoise: number) {
        normalizedNoise = (normalizedNoise + 1.0) / 2.0;
        return this.minAltitude + normalizedNoise * (this.maxAltitude - this.minAltitude);
    }

    strength(x: number, y: number) {
        let d = distance2(x, y, this.centerX, this.centerY) / 1e6;
        return d*d*d*d*d*d;
    }
}

const MIN_ALT = [
    -1.0,
    -0.6,
    -0.1,
    0.05,
    0.1,
    0.6,
    0.2,
    -0.25,
    -1.0
];

const MAX_ALT = [
    -0.8,
    0.1,
    0.05,
    0.2,
    0.4,
    0.8,
    1.0,
    0.05,
    0.1
];

export const OCEAN = 0;
export const OCEAN_MOUNTAINS = 1;
export const SEA = 2;
export const LAKE = 3;
export const SWAMP = 4;
export const PLAINS = 5;
export const HILLS = 6;
export const PLATEU = 7;
export const MOUNTAINS = 8;

const MAX_WATER_BIOME_ID = 3;
export const MAX_BIOME_ID = 8;

export function biome(id: number, x: number, y: number, options: GeneratorOptions) {
    return new Biome(x, y, alt(MIN_ALT[id], options), alt(MAX_ALT[id], options));
}

export function randomBiomeId(dist: Array<number>, randomValue: number): number {
    let prefixSum = 0.0;

    for (let i = 0; i < dist.length; i++) {
        prefixSum += dist[i];

        if (randomValue <= prefixSum)
            return i;
    }

    throw new Error();
}