import { Chunk } from './Chunk'
import type { Heightmap } from './Heightmap'

export class Terrain {
    readonly size: number;
    readonly scale: number;
    readonly chunkSize: number;
    readonly chunkGridSize: number;
    readonly chunkScale: number;
    readonly chunks: Array<Chunk>;

    constructor(scale: number, heightmap: Heightmap, chunkSize: number) {
        this.size = heightmap.size
        this.scale = scale
        this.chunkSize = chunkSize

        this.chunkGridSize = (heightmap.size - 0) / (chunkSize - 0)
        this.chunkScale = this.scale / this.chunkGridSize

        this.chunks = new Array(this.chunkGridSize*this.chunkGridSize)

        for (let i = 0; i < this.chunkGridSize; i++) {
            for (let j = 0; j < this.chunkGridSize; j++) {
                const base = i*this.chunkGridSize+j
                const chunkHeightmap = heightmap.subMap(
                    chunkSize,
                    Math.max(0, j*chunkSize-1),
                    Math.max(0, i*chunkSize-1)
                )

                this.chunks[base] = new Chunk(this.chunkScale, chunkHeightmap)
            }
        }
    }
}