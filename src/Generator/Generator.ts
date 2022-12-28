import { applyDefaults } from '../Defaults';
import { PerlinNoise } from '../PerlinNoise/PerlinNoise';
import { DefaultGeneratorOptions, type GeneratorOptions } from '../Terrain/GeneratorOptions';
import type { Heightmap } from '../Terrain/Heightmap'

export function generateTerrain(
    heightmap: Heightmap,
    options: GeneratorOptions = DefaultGeneratorOptions
) {
    applyDefaults(options, DefaultGeneratorOptions);

    heightmap.waterLevel = options.waterLevel;

    const mapHeuristicSize = (heightmap.width + heightmap.height) / 2;
    const centerX = Math.trunc(heightmap.width / 2), centerY = Math.trunc(heightmap.height / 2);

    for (let i = 0; i < Math.ceil(mapHeuristicSize * 0.2); i++) {
        const hillCenterX = Math.min(heightmap.width - 1, Math.round(Math.random() * heightmap.width));
        const hillCenterY = Math.min(heightmap.height - 1, Math.round(Math.random() * heightmap.height));

        const heightCoef = Math.random() * 80 - 40;
        const radiusCoef = Math.random() * 50 + 20;

        generateSmoothHill(heightmap, hillCenterX, hillCenterY, heightCoef, radiusCoef);
    }

    generateDetails(
        heightmap,
        options.seed,
        options.roughnessCoefficient,
        options.levelOfDetail,
        5
    );

    normalize(heightmap, options.minAltitude, options.maxAltitude);
}

function generateDetails(
    heightmap: Heightmap,
    seed: number,
    roughness: number,
    numSteps: number,
    scale: number = 1.0,
    roughnessStep: number = 3,
    altStep: number = 0.3,
) {
    const noiseGenerator = new PerlinNoise(seed)

    roughness /= 5.6;
    let altCoef = scale;

    for (let step = 0; step < numSteps; step++) {
        let noiseY = 0

        for (let i = 0; i < heightmap.height; i++) {
            let noiseX = 0

            for (let j = 0; j < heightmap.width; j++) {
                heightmap.data[i*heightmap.width+j] += altCoef * noiseGenerator.perlin2(noiseX, noiseY);
                noiseX += roughness
            }

            noiseY += roughness;
        }

        roughness *= roughnessStep;
        altCoef *= altStep;
    }
}

function normalize(heightmap: Heightmap, outMinAlt: number, outMaxAlt: number) {
    let minAlt = 1000.0, maxAlt = -1000.0;

    for (let i = 0; i < heightmap.data.length; i++) {
        minAlt = Math.min(minAlt, heightmap.data[i]);
        maxAlt = Math.max(maxAlt, heightmap.data[i]);
    }

    const altRange = maxAlt - minAlt;
    const outAltRange = outMaxAlt - outMinAlt;

    for (let i = 0; i < heightmap.data.length; i++) {
        heightmap.data[i] = outMinAlt + outAltRange * ((heightmap.data[i] - minAlt) / altRange);
    }
}

function generateSmoothHill(
    heightmap: Heightmap,
    centerX: number,
    centerY: number,
    heightCoef: number,
    radiusCoef: number
) {
    for (let i = 0; i < heightmap.height; i++) {
        for (let j = 0; j < heightmap.width; j++) {
            const d = distance(centerX, centerY, j, i);
            const delta = heightCoef * sigmoid_prime(d / radiusCoef);

            heightmap.data[i*heightmap.width+j] += delta;
        } 
    }
}

function distance(x1: number, y1: number, x2: number, y2: number) {
    const dx = x1 - x2, dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy);
}

function sigmoid_prime(x: number): number {
    const sigmoid_val = 1.0 / (1.0 + Math.exp(-x));
    return sigmoid_val * (1.0 - sigmoid_val);
}