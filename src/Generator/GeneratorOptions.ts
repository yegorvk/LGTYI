import { type BiomesDistribution, DefaultBiomesDistribution } from "./Biome";

export const MAX_ALT = 120;
export const MIN_ALT = -120;

export interface GeneratorOptions {
    width: number;
    height: number;
    maxAltitude: number;
    minAltitude: number;
    roughness: number;
    levelOfDetail: number;
    seed: number;
    waterLevel: number;
    biomes?: BiomesDistribution;
    numberOfBiomes?: number;
}

export const DefaultGeneratorOptions: GeneratorOptions = {
    width: 500,
    height: 500,
    maxAltitude: MAX_ALT,
    minAltitude: MIN_ALT,
    roughness: 0.5,
    levelOfDetail: 6,
    seed: 0,
    waterLevel: 0,
    biomes: DefaultBiomesDistribution,
    numberOfBiomes: 6
}