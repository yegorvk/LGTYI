import { applyDefaults } from '../Defaults';
import { PerlinNoise } from '../PerlinNoise/PerlinNoise';
import { DefaultGeneratorOptions, MIN_ALT, type GeneratorOptions, MAX_ALT } from './GeneratorOptions';
import type { Heightmap } from '../Terrain/Heightmap'
import seedrandom from 'seedrandom';
import { distance, map, map_array, map_pow, sigmoid_prime } from './Util';
import { Biome, HIGH_PEAKS, MAX_BIOME_ID, MAX_WATER_BIOME_ID, biome, normalizeBiomesDistribution, randomBiomeId } from './Biome';

const SCALE_INV = 2;

export function generateTerrain(
    heightmap: Heightmap,
    options: GeneratorOptions = DefaultGeneratorOptions
) {
    applyDefaults(options, DefaultGeneratorOptions);
    heightmap.waterLevel = options.waterLevel;

    const rng = seedrandom(options.seed);

    generateDetails(
        heightmap.data,
        heightmap.width,
        heightmap.height,
        options.seed,
        options.roughness,
        options.levelOfDetail,
        1.0
    );

    map_array(heightmap.data, -1.0, 1.0);

    const biomes = new Array<Biome>();
    const normDist = normalizeBiomesDistribution(options.biomes);

    let waterBiomes = false;
    let landBiomes = false;

    for (let i = 0; i <= MAX_WATER_BIOME_ID; i++) {
        if (normDist[i] > 0.0) {
            waterBiomes = true;
            break;
        }
    }

    for (let i = MAX_WATER_BIOME_ID; i <= MAX_BIOME_ID; i++) {
        if (normDist[i] > 0.0) {
            landBiomes = true;
            break;
        }
    }

    let hasWaterBiome = false;
    let hasLandBiome = false;

    for (let i = 0; i < options.numberOfBiomes; i++) {
        const biomeId = randomBiomeId(normDist, rng());

        const curBiome = biome(
            biomeId, 
            Math.floor(rng() * (options.width - 1)),
            Math.floor(rng() * (options.height - 1)),
            options
        );

        if (curBiome.id > MAX_WATER_BIOME_ID)
            hasLandBiome = true;
        else
            hasWaterBiome = true;

        biomes.push(curBiome);
    }

    if (!hasWaterBiome && waterBiomes) {
        const curBiome = biome(
            Math.round(rng() * MAX_WATER_BIOME_ID),
            biomes[0].centerX,
            biomes[0].centerY,
            options
        );

        biomes[0] = curBiome;
    }

    if (!hasLandBiome && landBiomes) {
        let id = Math.round(rng() * (MAX_BIOME_ID - MAX_WATER_BIOME_ID) + MAX_WATER_BIOME_ID);
        id = Math.min(MAX_BIOME_ID, id);
        
        const curBiome = biome(
            Math.round(id),
            biomes[0].centerX,
            biomes[0].centerY,
            options
        );

        biomes[0] = curBiome;
    }

    for (let i = 0; i < options.height; i++) {
        for (let j = 0; j < options.width; j++) {
            const k = i * options.width + j;

            let totalStrength = 0.0;
            let totalHeight = 0.0;

            for (let t = 0; t < biomes.length; t++) {
                const strength = biomes[t].strength(j, i, options.width, options.height);
                totalStrength += strength;

                const height = strength * biomes[t].height(heightmap.data[k]);
                totalHeight += height;
            }

            heightmap.data[k] = totalHeight / totalStrength;
        }
    }

    for (let i = 0; i < biomes.length; i++) {
        const cx = biomes[i].centerX, cy = biomes[i].centerY;
        const alt = heightmap.data[cy*options.width+cx];

        const maxH = MAX_ALT - alt;
        const minH = Math.max(0, (MAX_ALT-MIN_ALT)*0.8 + MIN_ALT - alt);

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
                rng() * 30 + 55
            );

            //generateRiver(heightmap, cx, cy);
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

    const temp = new Float32Array(heightmap.data.length/(SCALE_INV*SCALE_INV));

    /*for (let i = 0; i < Math.floor(heightmap.height/SCALE_INV); i++) {
        for (let j = 0; j < Math.floor(heightmap.width/SCALE_INV); j++) {
            temp[i*heightmap.width/SCALE_INV+j] = heightmap.data[i*SCALE_INV*heightmap.width+j*SCALE_INV];
        }
    }*/

    for (let i = 0; i < heightmap.height; i += SCALE_INV) {
        for (let j = 0; j < heightmap.width; j += SCALE_INV) {
            const i1 = Math.floor(i/SCALE_INV);
            const j1 = Math.floor(j/SCALE_INV);

            temp[i1*Math.floor(heightmap.width/SCALE_INV)+j1] = heightmap.data[i*heightmap.width+j];
        }
    }

    heightmap.data = temp;
    heightmap.width /= SCALE_INV;
    heightmap.height /= SCALE_INV;
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

    roughness /= 70;
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

function generateRiver(
    heightmap: Heightmap,
    startX: number,
    startY: number,
    step: number = 1,
) {
    const routeX = new Array<number>();
    const routeY = new Array<number>();

    while (true) {
        const cur = startY*heightmap.width+startX;

        if (heightmap.data[cur] <= 0)
            break;

        routeX.push(startX);
        routeY.push(startY);

        const candidateX = [
            startX - step,
            startX + step,
            startX,
            startX,
            startX - step,
            startX - step,
            startX + step,
            startX + step
        ];

        const candidateY = [
            startY,
            startY,
            startY - step,
            startY + step,
            startY + step,
            startY - step,
            startY + step,
            startY - step
        ];

        let best = cur;

        for (let i = 0; i < candidateX.length; i++) {
            if (candidateX[i] >= 0 && candidateX[i] < heightmap.width) {
                if (candidateY[i] >= 0 && candidateY[i] < heightmap.height) {
                    const k = candidateY[i] * heightmap.width + candidateX[i];

                    if (best === -1 || heightmap.data[best] > heightmap.data[k])
                        best = i;
                }
            }
        }

        if (best === cur)
            break;

        startX = candidateX[best];
        startY = candidateY[best];
    }

    for (let i = 0; i < routeX.length; i++) {
        generateSmoothHill(heightmap, routeX[i], routeY[i], -3.0, 4.0);
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