import type { GeneratorOptions } from "./GeneratorOptions";
import { alt, distance, distance2, sigmoid_prime } from "./Util";

export interface BiomesDistribution {
    oceanChance: number;
    seaChance: number;
    swampChance: number;
    plainsChance: number;
    hillsChance: number;
    plateauChance: number;
    lakeChance: number;
    highPeaksChance: number;
}

export const DefaultBiomesDistribution: BiomesDistribution = {
    oceanChance: 0.5,
    seaChance: 0.5,
    lakeChance: 0.5,
    swampChance: 0.5,
    plainsChance: 0.5,
    hillsChance: 0.5,
    plateauChance: 0.5,
    highPeaksChance: 0.5
};

export function normalizeBiomesDistribution(dist: BiomesDistribution): Array<number> {
    const chances = [
        dist.oceanChance,
        dist.seaChance,
        dist.lakeChance,
        dist.swampChance,
        dist.plainsChance,
        dist.hillsChance,
        dist.plateauChance,
        dist.highPeaksChance
    ];

    const total = chances.reduce((acc, chance) => acc + chance);
    return chances.map(value => value / total);
}

export class Biome {
    centerX: number;
    centerY: number;
    
    private minAltitude: number;
    private maxAltitude: number;

    private weight: number;

    id: number;

    constructor(
        id: number,
        centerX: number,
        centerY: number,
        minAltitude: number,
        maxAltitude: number,
        weight: number
    ) {
        this.id = id;

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

    /*strength(x: number, y: number, width: number, height: number) {
        return Math.pow(distance2(x, y, this.centerX, this.centerY) / (width*height) * this.weight, 2.0);
    }*/

    strength(x: number, y: number, width: number, height: number) {
        const d = distance(x, y, this.centerX, this.centerY);
        return sigmoid_prime(d / 70 * this.weight);
    }

    /*strength(x: number, y: number, width: number, height: number) {
        const d = Math.pow(distance(x, y, this.centerX, this.centerY), 0.7);
        return sigmoid_prime(d / 120 * Math.pow(this.weight, 0.5));
    }*/

    /*strength(x: number, y: number, width: number, height: number, biomeCount: number) {
        const impact = Math.sqrt(width*height/biomeCount);
        const val = Math.max(0, (impact - distance(x, y, this.centerX, this.centerY)) / impact);

        if (val === 0)
            return sigmoid_prime(distance(x, y, this.centerX, this.centerY) / 120);
        else
            return val;
    }*/
}

const MIN_ALT = [
    -1.0,
    -0.6,
    -0.2,
    -0.05,
    0.1,
    0.2,
    0.45,
    0.2
];

const MAX_ALT = [
    -0.7,
    -0.5,
    -0.01,
    -0.01,
    0.2,
    0.4,
    0.65,
    0.3
];

const WEIGHT = [
    0.8,
    0.8,
    1.0,
    1.1,
    1.0,
    1.0,
    1.0,
    2.0,
];

export const OCEAN = 0;
export const SEA = 1;
export const LAKE = 2;
export const SWAMP = 3;
export const PLAINS = 4;
export const HILLS = 5;
export const PLATEAU = 6;
export const HIGH_PEAKS = 7;

export const MAX_WATER_BIOME_ID = 2;
export const MAX_BIOME_ID = 7;

export function biome(id: number, x: number, y: number, options: GeneratorOptions) {
    return new Biome(id, x, y, alt(MIN_ALT[id], options), alt(MAX_ALT[id], options), WEIGHT[id]);
}

export function randomBiomeId(dist: Array<number>, randomValue: number): number {
    let prefixSum = 0.0;

    for (let i = 0; i < dist.length; i++) {
        prefixSum += dist[i];

        if (randomValue <= prefixSum)
            return i;
    }

    return dist.length-1;
}