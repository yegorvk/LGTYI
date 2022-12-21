export interface GeneratorOptions {
    width: number;
    height: number;
    maxAltitude: number;
    minAltitude: number;
    roughnessCoefficient: number;
    levelOfDetail: number;
    seed: number;
}

export const DefaultGeneratorOptions: GeneratorOptions = {
    width: 200,
    height: 100,
    maxAltitude: 35,
    minAltitude: 10,
    roughnessCoefficient: 0.5,
    levelOfDetail: 6,
    seed: 0
}