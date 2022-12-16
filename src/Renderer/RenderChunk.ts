import * as THREE from 'three'
import type { Chunk } from '../Terrain/Chunk'

export class RenderChunk extends THREE.Object3D {
    constructor(chunk: Chunk, options: RenderChunkOptions = DefaultOptions) {
        super()

        options = this.parseOptions(options)

        const terrain = this.createTerrain(chunk, options)
        super.add(terrain)
    }

    private createTerrain(chunk: Chunk, options: RenderChunkOptions): THREE.Object3D {
        const geometry = new THREE.BufferGeometry()

        const posAttr = new THREE.BufferAttribute(chunk.vertices, 3)
        geometry.setAttribute('position', posAttr)

        const colorAttr = new THREE.BufferAttribute(chunk.vertexColors, 3)
        geometry.setAttribute('color', colorAttr)

        const indexAttr = new THREE.BufferAttribute(chunk.indices, 1)
        geometry.setIndex(indexAttr)

        if (options.prepareForLighting)
            geometry.computeVertexNormals()

        const mat = this.createTerrainMaterial(options)

        const terrain = new THREE.Mesh(geometry, mat)

        if (options.useWireframe) {
            const wireframeGeometry = new THREE.WireframeGeometry(geometry)

            const wireframeMat = new THREE.LineBasicMaterial({ 
                color: options.wireframeColor,
                linewidth: options.wireframeLineWidth,
                opacity: options.wireframeOpacity,
                depthTest: true,
                transparent: true
            })

            const wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMat)
            terrain.add(wireframe)
        }

        return terrain
    }

    private createTerrainMaterial(options: RenderChunkOptions): THREE.Material {
        const mat = options.prepareForLighting ? 
                                    new THREE.MeshPhongMaterial() :
                                    new THREE.MeshBasicMaterial()

        //mat.color.set(0x00FF00)
        mat.vertexColors = true
        mat.side = THREE.FrontSide
        
        return mat
    }

    private parseOptions(options: RenderChunkOptions): RenderChunkOptions {
        for (const key in options) {
            if (options[key] === undefined)
                options[key] = DefaultOptions[key]
        }

        return options
    }
}

export interface RenderChunkOptions {
    useWireframe?: boolean;
    wireframeColor?: number;
    wireframeOpacity?: number;
    wireframeLineWidth?: number;
    prepareForLighting?: boolean;
}

const DefaultOptions: RenderChunkOptions = {
    useWireframe: true,
    wireframeColor: 0xFFFFFF,
    wireframeOpacity: 0.15,
    wireframeLineWidth: 1.3,
    prepareForLighting: true
}