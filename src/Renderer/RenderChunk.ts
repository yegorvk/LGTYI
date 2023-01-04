import * as THREE from 'three'
import {applyDefaults} from '../Defaults'
import type {Chunk} from '../Terrain/Chunk'
import {type RenderOptions, DefaultRenderOptions} from './RenderOptions'

export class RenderChunk extends THREE.Object3D {
    private terrainScale: number;
    private grassNormal: THREE.Texture;

    constructor(offset: THREE.Vector3, scale: number, chunk: Chunk, options: RenderOptions = DefaultRenderOptions) {
        super()

        applyDefaults(options, DefaultRenderOptions);

        this.grassNormal = new THREE.TextureLoader().load('assets/textures/terrain_bump.jpg');

        this.grassNormal.wrapS = THREE.RepeatWrapping;
        this.grassNormal.wrapT = THREE.RepeatWrapping;

        this.grassNormal.magFilter = THREE.LinearFilter;
        this.grassNormal.minFilter = THREE.NearestMipMapNearestFilter;

        this.grassNormal.generateMipmaps = true;
        this.grassNormal.needsUpdate = true;

        this.terrainScale = scale;

        const terrain = this.createTerrain(offset, chunk, options)
        super.add(terrain)
    }

    private createTerrain(offset: THREE.Vector3, chunk: Chunk, options: RenderOptions): THREE.Object3D {
        const geometry = new THREE.BufferGeometry()

        const posAttr = new THREE.Float32BufferAttribute(chunk.vertices, 3)
        geometry.setAttribute('position', posAttr)

        const uvAttr = new THREE.Float32BufferAttribute(chunk.uv, 2);
        geometry.setAttribute('uv', uvAttr);

        if (chunk.useVertexColors) {
            const colorAttr = new THREE.Float32BufferAttribute(chunk.vertexColors, 3)
            geometry.setAttribute('color', colorAttr)
        }

        const indexAttr = new THREE.Uint32BufferAttribute(chunk.indices, 1);
        geometry.setIndex(indexAttr);

        geometry.scale(this.terrainScale, this.terrainScale, this.terrainScale * 2);

        if (options.prepareForLighting)
            geometry.computeVertexNormals()

        const mat = this.createTerrainMaterial(options)

        const terrain = new THREE.Mesh(geometry, mat)
        terrain.position.add(offset)

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

    private createTerrainMaterial(options: RenderOptions): THREE.Material {
        const mat = options.prepareForLighting ?
            new THREE.MeshPhongMaterial({
                bumpMap: this.grassNormal
            }) : new THREE.MeshBasicMaterial();

        if (options.prepareForLighting) {
            (mat as THREE.MeshPhongMaterial).shininess = 0.1;
        }

        if (options.vertexColors)
            mat.vertexColors = true
        else
            mat.color.set(0x000000)

        return mat
    }

    dispose() {
        this.grassNormal.dispose();
    }
}