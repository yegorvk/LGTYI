import { applyDefaults } from "../Defaults";
import { PerlinNoise } from "../PerlinNoise/PerlinNoise";
import { DefaultGeneratorOptions, type GeneratorOptions } from "./GeneratorOptions";

export class Heightmap {
    size: number;

    offsetX: number;
    offsetY: number;

    // heightmap data (row-major order)
    data: Float32Array;

    static generate(
        options: GeneratorOptions
    ): Heightmap {
        applyDefaults(options, DefaultGeneratorOptions)
        
        const heightmap = Heightmap.flat(options.size, 0)
        const noiseGenerator = new PerlinNoise()

        let roughness = options.roughnessCoefficient / 5.6
        let maxAlt = (options.maxAltitude - options.minAltitude)

        for (let pass = 0; pass < options.levelOfDetail; pass++) {
            let noiseY = 0

            for (let i = 0; i < heightmap.size; i++) {
                let noiseX = 0

                for (let j = 0; j < heightmap.size; j++) {
                    const base = i*heightmap.size+j
                    const delta = noiseGenerator.perlin2(noiseX, noiseY)

                    heightmap.data[base] += 0.01 + (maxAlt / 2) * (delta + 1)

                    noiseX += roughness
                }

                noiseY += roughness
            }

            roughness *= 3
            maxAlt *= 0.3
        }

        for (let i = 0; i < heightmap.data.length; i++) {
            heightmap.data[i] += options.minAltitude;
        }

        return heightmap
    }

    static flat(size: number, fillValue?: number) {
        const data = new Float32Array(size*size)

        if (fillValue !== undefined)
            data.fill(fillValue)

        return new Heightmap(size, data)
    }

    constructor(
        size: number,
        data: Float32Array,
        offsetX: number = 0,
        offsetY: number = 0
    ) {
        this.size = size
        this.data = data
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    subMap(size: number, offsetX: number, offsetY: number): Heightmap {
        return new Heightmap(
            size,
            this.data,
            this.offsetX + offsetX,
            this.offsetY + offsetY
        )
    }
}