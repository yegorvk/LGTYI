export interface GeneratorOptions {
    width: number;
    height: number;
    maxAltitude: number;
    minAltitude: number;
    roughness: number;
    levelOfDetail: number;
    seed: number;
    waterLevel: number;
}

export const DefaultGeneratorOptions: GeneratorOptions = {
    width: 500,
    height: 500,
    maxAltitude: 50,
    minAltitude: -50,
    roughness: 0.09,
    levelOfDetail: 6,
    seed: 0,
    waterLevel: 10
}