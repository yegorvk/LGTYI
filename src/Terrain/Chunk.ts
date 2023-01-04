import Jimp from 'jimp/*';
import type { Heightmap } from './Heightmap'
import { colorRGBFromAltitude, DefaultGradientSettings, type GradientSettings } from './PointColor';

const SCALE_FACTOR = 1;

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

    uv: Float32Array;

    // terrain heightmap
    heightmap: Heightmap;

    constructor(
        scale: number,
        heightmap: Heightmap,
        useVertexColors: boolean,
        gradientSettings: GradientSettings = DefaultGradientSettings 
    ) {
        this.scale = scale
        this.width = heightmap.width;
        this.height = heightmap.height;
        this.heightmap = heightmap;
        this.useVertexColors = useVertexColors;

        this.width /= SCALE_FACTOR;
        this.height /= SCALE_FACTOR;

        this.scale *= SCALE_FACTOR;

        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);

        this.generateVertices();
        this.generateUvs();
        this.generateIndices();

        if (useVertexColors)
            this.generateVertexColors(gradientSettings);
    }

    private generateVertices() {
        this.vertices = new Float32Array(3 * this.width * this.height)

        const offsetX = this.scale * (this.width - 1) / 2;
        const offsetY = this.scale * (this.height - 1) / 2;

        console.log(this);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const base = this.mIndex(i, j)
                const hBase = this.mIndex(SCALE_FACTOR*SCALE_FACTOR*(this.height - i - 1), SCALE_FACTOR * j);

                this.vertices[3 * base] = this.scale * j - offsetX
                this.vertices[3 * base + 1] = this.scale * i - offsetY
                this.vertices[3 * base + 2] = this.heightmap.data[hBase]
            }
        }
    }

    private generateUvs() {
        this.uv = new Float32Array(2 * this.width * this.height);

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const base = this.mIndex(i, j);

                const u = j / 20.0;
                const v = i / 20.0;

                this.uv[2 * base] = u;
                this.uv[2 * base + 1] = v;

                //this.uv[2 * base] = (i / 20.0 - Math.floor(i / 20.0)) + (Math.floor(i / 20) % 2);
                //this.uv[2 * base + 1] = j / 20.0 - Math.floor(j / 20.0) + (Math.floor(j / 20) % 2);
            }
        }
    }

    private generateVertexColors(gradientSettings: GradientSettings) {
        this.vertexColors = new Float32Array(3 * this.width * this.height)

        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                const base = this.mIndex(i, j);
                const hBase = this.mIndex(SCALE_FACTOR*SCALE_FACTOR*(this.height - i - 1), SCALE_FACTOR * j);

                const colorRGB = colorRGBFromAltitude(
                    this.heightmap.data[hBase],
                    this.heightmap.waterLevel,
                    false,
                    gradientSettings
                )

                this.vertexColors[3 * base] = ((colorRGB >> 16) & 0xFF) / 255
                this.vertexColors[3 * base + 1] = ((colorRGB >> 8) & 0xFF) / 255
                this.vertexColors[3 * base + 2] = (colorRGB & 0xFF) / 255
            }
        }
    }

    private generateIndices() {
        const triangleCount = 2 * this.width * this.height;
        this.indices = new Uint32Array(3 * triangleCount);

        for (let i = 0; i < this.height - 1; i++) {
            for (let j = 0; j < this.width - 1; j++) {
                const base = this.mIndex(i, j)

                this.indices[3 * (2 * base)] = base;
                this.indices[3 * (2 * base) + 1] = base + 1;
                this.indices[3 * (2 * base) + 2] = base + this.width;

                this.indices[3 * (2 * base + 1)] = base + this.width;
                this.indices[3 * (2 * base + 1) + 1] = base + 1;
                this.indices[3 * (2 * base + 1) + 2] = base + this.width + 1;
            }
        }
    }

    private mIndex(i: number, j: number): number {
        return i * this.width + j
    }
}