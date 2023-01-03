import { applyDefaults } from '../Defaults';
import { PerlinNoise } from '../PerlinNoise/PerlinNoise';
import { DefaultGeneratorOptions, MIN_ALT, type GeneratorOptions, MAX_ALT } from './GeneratorOptions';
import type { Heightmap } from '../Terrain/Heightmap'
import seedrandom from 'seedrandom';
import { distance, map, map_array, map_pow, sigmoid_prime } from './Util';
import { Biome, HIGH_PEAKS, biome, normalizeBiomesDistribution, randomBiomeId } from './Biome';

export function generateTerrain(
    heightmap: Heightmap,
    options: GeneratorOptions = DefaultGeneratorOptions
) {
    applyDefaults(options, DefaultGeneratorOptions);
    heightmap.waterLevel = options.waterLevel;

    const temp = new Float32Array(heightmap.data.length);
    const rng = seedrandom(options.seed);

    generateDetails(
        temp,
        heightmap.width,
        heightmap.height,
        options.seed,
        options.roughness,
        options.levelOfDetail,
        1.0
    );

    map_array(temp, -1.0, 1.0);

    const biomes = new Array<Biome>();
    const normDist = normalizeBiomesDistribution(options.biomes);

    for (let i = 0; i < options.numberOfBiomes; i++) {
        const biomeId = randomBiomeId(normDist, rng());

        biomes.push(
            biome(
                biomeId, 
                Math.floor(rng() * (options.width - 1)),
                Math.floor(rng() * (options.height - 1)),
                options
            )
        )
    }

    for (let i = 0; i < options.height; i++) {
        for (let j = 0; j < options.width; j++) {
            const k = i * options.width + j;

            let totalStrength = 0.0;
            let totalHeight = 0.0;

            for (let t = 0; t < biomes.length; t++) {
                const strength = biomes[t].strength(j, i, options.width, options.height);
                totalStrength += strength;

                const height = strength * biomes[t].height(temp[k]);
                totalHeight += height;
            }

            heightmap.data[k] = totalHeight / totalStrength;
        }
    }

    for (let i = 0; i < biomes.length; i++) {
        const cx = biomes[i].centerX, cy = biomes[i].centerY;
        const alt = heightmap.data[cy*options.width+cx];

        const maxH = MAX_ALT - alt;
        const minH = Math.max(0, (MAX_ALT-MIN_ALT)*0.9 + MIN_ALT - alt);

        const h = Math.min(
            (MAX_ALT - alt) * 4,
            (rng() * (maxH - minH) + minH) * 4
        );

        if (h !== 0 && biomes[i].id === HIGH_PEAKS) {
            generateSmoothHill(
                heightmap,
                cx,
                cy,
                h,
                rng() * 20 + 40
            );
        }
    }

    let maxHeight = MIN_ALT;
    let minHeight = MAX_ALT;

    for (let i = 0; i < heightmap.data.length; i++) {
        minHeight = Math.min(heightmap.data[i], minHeight);
        maxHeight = Math.max(heightmap.data[i], maxHeight);
    }

    for (let i = 0; i < heightmap.data.length; i++) {
        heightmap.data[i] = map(
            heightmap.data[i],
            minHeight,
            maxHeight, 
            Math.max(minHeight, MIN_ALT),
            Math.min(maxHeight, MAX_ALT),
        );
    }
}

export function generateSimpleTerrain(heightmap: Heightmap, options: GeneratorOptions) {
    applyDefaults(options, DefaultGeneratorOptions);

    generateDetails(
        heightmap.data,
        heightmap.width,
        heightmap.height,
        options.seed,
        options.roughness,
        options.levelOfDetail
    );

    map_pow(
        heightmap.data,
        options.minAltitude,
        options.maxAltitude,
        0.7
    );
}

function generateDetails(
    heightmap: Float32Array,
    width: number,
    height: number,
    seed: number,
    roughness: number,
    numSteps: number,
    scale: number = 1.0,
    roughnessStep: number = 3,
    altStep: number = 0.3,
) {
    const noiseGenerator = new PerlinNoise(seed)

    roughness /= 80;
    let altCoef = scale;

    for (let step = 0; step < numSteps; step++) {
        let noiseY = 0

        for (let i = 0; i < height; i++) {
            let noiseX = 0

            for (let j = 0; j < width; j++) {
                heightmap[i*width+j] += altCoef * noiseGenerator.simplex2(noiseX, noiseY);
                noiseX += roughness
            }

            noiseY += roughness;
        }

        roughness *= roughnessStep;
        altCoef *= altStep;
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