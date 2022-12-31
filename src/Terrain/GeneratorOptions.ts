
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
    hillyness?: number;
}

export const DefaultGeneratorOptions: GeneratorOptions = {
    width: 500,
    height: 500,
    maxAltitude: MAX_ALT,
    minAltitude: MIN_ALT,
    roughness: 0.4,
    levelOfDetail: 6,
    seed: 0,
    waterLevel: 0,
    hillyness: 0.6
}