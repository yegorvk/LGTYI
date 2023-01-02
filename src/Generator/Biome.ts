import { HtmlTagHydration } from "svelte/internal";
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
    oceanChance: 0.5,
    oceanMountainsChance: 0.5,
    seaChance: 0.5,
    lakeChance: 0.5,
    swampChance: 0.5,
    plainsChance: 0.5,
    hillsChance: 0.5,
    plateuChance: 0.5,
    mountainsChance: 0.5,
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

    private weight: number;

    constructor(
        centerX: number,
        centerY: number,
        minAltitude: number,
        maxAltitude: number,
        weight: number
    ) {
        this.minAltitude = minAltitude;
        this.maxAltitude = maxAltitude;

        this.weight = weight;

        this.centerX = centerX;
        this.centerY = centerY;
    }

    height(normalizedNoise: number) {
        normalizedNoise = (normalizedNoise + 1.0) / 2.0;
        return this.minAltitude + normalizedNoise * (this.maxAltitude - this.minAltitude);
    }

    strength(x: number, y: number, width: number, height: number) {
        let d = distance2(x, y, this.centerX, this.centerY) / (width*height);
        return d*d*d * this.weight;
    }
}

const MIN_ALT = [
    -1.0,
    -0.8,
    -0.6,
    -0.08,
    -0.04,
    0.1,
    0.12,
    0.5,
    0.6
];

const MAX_ALT = [
    -0.7,
    -0.5,
    -0.3,
    0.05,
    0.02,
    0.3,
    0.4,
    0.7,
    1.0
];

const WEIGHT = [
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0,
    1.0
];

export const OCEAN = 0;
export const OCEAN_MOUNTAINS = 1;
export const SEA = 2;
export const LAKE = 3;
export const SWAMP = 4;
export const PLAINS = 5;
export const HILLS = 6;
export const PLATEU = 7;
export const EXTREME_PEAKS = 8;

const MAX_WATER_BIOME_ID = 3;
export const MAX_BIOME_ID = 8;

export function biome(id: number, x: number, y: number, options: GeneratorOptions) {
    return new Biome(x, y, alt(MIN_ALT[id], options), alt(MAX_ALT[id], options), WEIGHT[id]);
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