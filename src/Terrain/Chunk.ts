import type { Heightmap } from './Heightmap'
import { colorGrayScaleFromAltitude, colorRGBFromAltitude, rgbFromGrayScale } from './PointColor';

export class Chunk {
    // space between vertices
    readonly scale: number;

    // number of vertices in each row 
    readonly width: number;

    // number of vertices in each column
    readonly height: number;

    readonly useVertexColors: boolean;

    // terrain vertices on xy place (row-major, rows along x-axis)
    // all values in [-scale; scale]
    vertices: Float32Array;

    vertexColors: Float32Array;

    // terrain indices on xy plane
    // suitable for rendering with GL_TRIANGLES (Mesh in three.js)
    indices: Uint32Array;

    // terrain heightmap
    heightmap: Heightmap;

    constructor(scale: number, heightmap: Heightmap, useVertexColors: boolean) {
        this.scale = scale
        this.width = heightmap.width;
        this.height = heightmap.height;
        this.heightmap = heightmap;

        this.generateVertices()        
        this.generateIndices()

        if (useVertexColors)
            this.generateVertexColors()
    }

    private generateVertices() {
        this.vertices = new Float32Array(3*this.width*this.height)

        const offsetX = this.scale * (this.width - 1) / 2;
        const offsetY = this.scale * (this.height - 1) / 2;

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const base = this.mIndex(i, j)
                const hBase = this.mIndex(
                    this.heightmap.offsetY + i,
                    this.heightmap.offsetX + j
                )

                this.vertices[3*base] = this.scale * j - offsetX
                this.vertices[3*base+1] = this.scale * i - offsetY
                this.vertices[3*base+2] = this.heightmap.data[hBase]
            }
        }
    }

    private generateVertexColors() {
        this.vertexColors = new Float32Array(3*this.width*this.height)

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const base = this.mIndex(i, j)
                const hBase = this.mIndex(
                    this.heightmap.offsetY + i,
                    this.heightmap.offsetX + j
                )

                const colorRGB = colorRGBFromAltitude(this.heightmap.data[hBase])
            
                this.vertexColors[3*base] = ((colorRGB >> 16) & 0xFF) / 255
                this.vertexColors[3*base+1] = ((colorRGB >> 8) & 0xFF) / 255
                this.vertexColors[3*base+2] = (colorRGB & 0xFF) / 255
             }
        }        
    }

    private generateIndices() {
        const triangleCount = 2 * this.width * this.height
        this.indices = new Uint32Array(3 * triangleCount)

        for (let i = 0; i < this.height - 1; i++) {
            for (let j = 0; j < this.width - 1; j++) {
                const base = this.mIndex(i, j)

                this.indices[3*(2*base)] = base
                this.indices[3*(2*base)+1] = base + 1
                this.indices[3*(2*base)+2] = base + this.width

                this.indices[3*(2*base+1)] = base + this.width
                this.indices[3*(2*base+1)+1] = base + 1;
                this.indices[3*(2*base+1)+2] = base + this.width + 1
            }
        }
    }

    private mIndex(i: number, j: number): number {
        return i * this.width + j
    }
}