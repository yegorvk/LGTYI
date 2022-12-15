import { space } from 'svelte/internal';
import * as THREE from 'three'
import * as noise1 from '../extern/perlin.js'

export class RenderChunk {
    // chunk width and height
    scale: number;

    // number of dots in each column or row 
    dotsPerDimension: number;

    // terrain vertices on xy place (x-first repr, rows in the direction of x+, row major ordering, asc order)
    // x and y in the range [-scale; scale]
    vertices: Float32Array;

    // terrain indices on xy plane
    // suitable for rendering with GL_TRIANGLES (Mesh in three.js)
    indices: Uint32Array;

    // terrain heightmap
    heightmap: Float32Array;

    constructor(scale: number, dotsPerDimension: number) {
        this.scale = scale
        this.dotsPerDimension = dotsPerDimension

        this.generateHeightmap()
        this.generateVertices()
        this.generateIndices()
    }

    private generateHeightmap() {
        this.heightmap = new Float32Array(this.dotsPerDimension*this.dotsPerDimension)

        // Here we are refering to global object outside of this file, so
        // your editor might highlight it as an error.
        noise.seed()

        let yoff = 0 

        for (let i = 0; i < this.dotsPerDimension; i++) {
            let xoff = 0

            for (let j = 0; j < this.dotsPerDimension; j++) {
                const base = this.mIndex(i, j)

                // Here we are refering to global object outside of this file, so
                // your editor might highlight it as an error.
                this.heightmap[base] = noise.perlin2(xoff, yoff) * 3

                xoff += 0.1
            }

            yoff += 0.1
        }

        /*for (let i = 0; i < this.dotsPerDimension; i++) {
            for (let j = 0; j < this.dotsPerDimension; j++) {
                const base = this.mIndex(i, j)
                this.heightmap[base] = 0
            }
        }*/
    }

    private generateVertices() {
        this.vertices = new Float32Array(3*this.dotsPerDimension*this.dotsPerDimension)
        
        const spaceBetweenDots = this.scale / (this.dotsPerDimension - 1)
        const offset = this.scale / 2;

        for (let i = 0; i < this.dotsPerDimension; i++) {
            for (let j = 0; j < this.dotsPerDimension; j++) {
                const base = this.mIndex(i, j)

                this.vertices[3*base] = spaceBetweenDots * j - offset
                this.vertices[3*base+1] = spaceBetweenDots * i - offset
                this.vertices[3*base+2] = this.heightmap[base]
            }
        }
    }

    private generateIndices() {
        const triangleCount = 2 * this.dotsPerDimension * this.dotsPerDimension
        this.indices = new Uint32Array(3 * triangleCount)

        for (let i = 0; i < this.dotsPerDimension - 1; i++) {
            for (let j = 0; j < this.dotsPerDimension - 1; j++) {
                const base = this.mIndex(i, j)

                this.indices[3*(2*base)] = base
                this.indices[3*(2*base)+1] = base + 1
                this.indices[3*(2*base)+2] = base + this.dotsPerDimension

                this.indices[3*(2*base+1)] = base + this.dotsPerDimension
                this.indices[3*(2*base+1)+1] = base + 1;
                this.indices[3*(2*base+1)+2] = base + this.dotsPerDimension + 1
            }
        }
    }

    private mIndex(i: number, j: number): number {
        return i * this.dotsPerDimension + j
    }
}