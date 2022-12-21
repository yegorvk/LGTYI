export interface GeneratorOptions {
    size: number;
    maxAltitude: number;
    minAltitude: number;
    roughnessCoefficient: number;
    levelOfDetail: number;
}

export const DefaultGeneratorOptions: GeneratorOptions = {
    size: 100,
    maxAltitude: 35,
    minAltitude: 10,
    roughnessCoefficient: 0.5,
    levelOfDetail: 6
}