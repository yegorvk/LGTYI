import { applyDefaults } from "../Defaults";
import { PerlinNoise } from "../PerlinNoise/PerlinNoise";
import { DefaultGeneratorOptions, type GeneratorOptions } from "./GeneratorOptions";

export class Heightmap {
    width: number;
    height: number;

    offsetX: number;
    offsetY: number;

    // heightmap data (row-major order)
    data: Float32Array;

    static generate(
        options: GeneratorOptions
    ): Heightmap {
        applyDefaults(options, DefaultGeneratorOptions)
        
        const heightmap = Heightmap.flat(options.width, options.height, 0)
        const noiseGenerator = new PerlinNoise()

        let roughness = options.roughnessCoefficient / 5.6
        let maxAlt = (options.maxAltitude - options.minAltitude)

        for (let pass = 0; pass < options.levelOfDetail; pass++) {
            let noiseY = 0

            for (let i = 0; i < heightmap.height; i++) {
                let noiseX = 0

                for (let j = 0; j < heightmap.width; j++) {
                    const base = i*heightmap.width+j
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

    static flat(width: number, height: number, fillValue: number = 0) {
        const data = new Float32Array(width*height)

        if (fillValue !== 0)
            data.fill(fillValue)

        return new Heightmap(width, height, data)
    }

    constructor(
        width: number,
        height: number,
        data: Float32Array,
        offsetX: number = 0,
        offsetY: number = 0
    ) {
        this.width = width;
        this.height = height;
        this.data = data
        this.offsetX = offsetX;
        this.offsetY = offsetY;
    }

    subMap(width: number, height: number, offsetX: number, offsetY: number): Heightmap {
        if (width > this.width - offsetX || height > this.height - offsetY)
            throw new Error()
        
        return new Heightmap(
            width,
            height,
            this.data,
            this.offsetX + offsetX,
            this.offsetY + offsetY
        )
    }
}