import { PerlinNoise } from "../PerlinNoise/PerlinNoise";

export class Heightmap {
    size: number;

    offsetX: number;
    offsetY: number;

    // heightmap data (row-major order)
    data: Float32Array;

    static generate(
        size: number,
        maxAltitude: number,
        roughness: number,
        levelOfDetail: number
    ): Heightmap {
        const heightmap = Heightmap.flat(size)
        const noiseGenerator = new PerlinNoise()

        // adjust roughness
        roughness /= 5.6

        let noiseY = 0

        for (let i = 0; i < heightmap.size; i++) {
            let noiseX = 0

            for (let j = 0; j < heightmap.size; j++) {
                const base = i*heightmap.size+j
                heightmap.data[base] = noiseGenerator.perlin2(noiseX, noiseY) * maxAltitude

                noiseX += roughness
            }

            noiseY += roughness
        }

        return heightmap
    }

    static generateMultipass(
        size: number,
        maxAltitude: number,
        roughness: number,
        levelOfDetail: number
    ): Heightmap {
        const heightmap = Heightmap.flat(size, 0)
        const noiseGenerator = new PerlinNoise()

        // adjust roughness
        roughness /= 5.6

        for (let pass = 0; pass < levelOfDetail; pass++) {
            let noiseY = 0

            for (let i = 0; i < heightmap.size; i++) {
                let noiseX = 0

                for (let j = 0; j < heightmap.size; j++) {
                    const base = i*heightmap.size+j
                    heightmap.data[base] += noiseGenerator.perlin2(noiseX, noiseY) * maxAltitude

                    noiseX += roughness
                }

                noiseY += roughness
            }

            roughness *= 3
            maxAltitude *= 0.3
        }

        return heightmap
    }

    static flat(size: number, fillValue?: number) {
        const data = new Float32Array(size*size)

        if (fillValue !== undefined)
            data.fill(fillValue)

        return new Heightmap(size, data)
    }

    private constructor(
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