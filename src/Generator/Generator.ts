import { applyDefaults } from '../Defaults';
import { PerlinNoise } from '../PerlinNoise/PerlinNoise';
import { DefaultGeneratorOptions, MIN_ALT, type GeneratorOptions } from './GeneratorOptions';
import type { Heightmap } from '../Terrain/Heightmap'
import seedrandom from 'seedrandom';
import { distance, map, map_array, map_pow, sigmoid_prime } from './Util';
import { Biome, MAX_BIOME_ID, biome, normalizeBiomesDistribution, randomBiomeId } from './Biome';

export function generateTerrain(
    heightmap: Heightmap,
    options: GeneratorOptions = DefaultGeneratorOptions
) {
    applyDefaults(options, DefaultGeneratorOptions);
    heightmap.waterLevel = options.waterLevel;

    const temp = new Float32Array(heightmap.data.length);
    const rng = seedrandom(options.seed);

    /*generate(
        heightmap,
        temp,
        options.seed,
        options.roughness + 0.5,
        options.levelOfDetail
    );*/

    generateDetails(
        temp,
        heightmap.width,
        heightmap.height,
        options.seed,
        options.roughness,
        options.levelOfDetail,
        1.0,
        3.0,
        0.2
    );

    map_array(temp, -1.0, 1.0);

    const biomes = new Array<Biome>();
    const normDist = normalizeBiomesDistribution(options.biomes);

    console.log(normDist);

    for (let i = 0; i < options.numberOfBiomes; i++) {
        const biomeId = randomBiomeId(normDist, rng());

        biomes.push(
            biome(
                biomeId, 
                rng() * options.width * 0.9,
                rng() * options.height * 0.9,
                options
            )
        )
    }

    console.log(biomes);

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

function generate(
    heightmap: Heightmap,
    out: Float32Array,
    seed: number,
    roughnessCoef: number = 1.0,
    levelOfDetails: number = 10
) {
    out.fill(0.0);
    let scale = 1.0;

    for (let i = 0; i < 9; i++) {
        generateDetails(
            out,
            heightmap.width,
            heightmap.height,
            seed,
            1.0 * roughnessCoef,
            levelOfDetails,
            scale,
            3,
            0.2
        );

        map_pow(out, -1.0, 1.0, 1.0 + 1.0/7.0);
        scale -= 0.1;
    }
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

    roughness /= 40;
    let altCoef = scale;

    for (let step = 0; step < numSteps; step++) {
        let noiseY = 0

        for (let i = 0; i < height; i++) {
            let noiseX = 0

            for (let j = 0; j < width; j++) {
                heightmap[i*width+j] += altCoef * noiseGenerator.perlin2(noiseX, noiseY);
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