import * as THREE from 'three'
import {applyDefaults} from '../Defaults'
import type {Chunk} from '../Terrain/Chunk'
import {type RenderOptions, DefaultRenderOptions} from './RenderOptions'
import { ResourceManager } from './ResourceManager';
import * as terrainShaders from '../Shaders/terrain.glsl';

export class RenderChunk extends THREE.Object3D {
    private readonly terrainScale: number = null;

    private readonly grassNormal: THREE.Texture = null;
    private readonly terrainTexture: THREE.Texture = null;

    private readonly resources: ResourceManager = new ResourceManager();

    constructor(offset: THREE.Vector3, scale: number, chunk: Chunk, options: RenderOptions = DefaultRenderOptions) {
        super()

        applyDefaults(options, DefaultRenderOptions);

        if (options.vertexColors || options.textures) {
            this.grassNormal = new THREE.TextureLoader().load('assets/textures/terrain_bump.jpg');
            this.resources.register(this.grassNormal);

            this.grassNormal.wrapS = THREE.RepeatWrapping;
            this.grassNormal.wrapT = THREE.RepeatWrapping;

            this.grassNormal.magFilter = THREE.LinearFilter;
            this.grassNormal.minFilter = THREE.NearestMipMapNearestFilter;

            this.grassNormal.generateMipmaps = true;
        }

        if (options.textures) {
            this.terrainTexture = new THREE.TextureLoader().load('assets/textures/terrain_rock.jpg');
            this.resources.register(this.terrainTexture);

            this.terrainTexture.wrapS = THREE.RepeatWrapping;
            this.terrainTexture.wrapT = THREE.RepeatWrapping;
        
            this.terrainTexture.magFilter = THREE.LinearFilter;
            this.terrainTexture.minFilter = THREE.LinearMipMapLinearFilter;

            this.terrainTexture.generateMipmaps = true;
        }

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

        if (options.vertexColors) {
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
        if (options.prepareForLighting) {
            const uniforms = THREE.UniformsUtils.merge([
                THREE.ShaderLib.phong.uniforms,
                {
                    diffuse: { value: new THREE.Color(0xFFFFFF) },
                    bumpMap: { value: (this.grassNormal !== null) ? this.grassNormal : undefined },
                    map: { value: (this.terrainTexture !== null) ? this.terrainTexture : undefined },
                    shininess: { value: 0.1 }
                }
            ]);

            return new THREE.ShaderMaterial({
                vertexShader: terrainShaders.vertex,
                fragmentShader: terrainShaders.fragment,
                vertexColors: options.vertexColors,
                lights: true,
                uniforms: uniforms,
                defines: {
                    USE_UV: true,
                    USE_MAP: options.textures,
                    USE_BUMPMAP: true
                }
            });
        } else {
            return new THREE.MeshBasicMaterial({
                vertexColors: options.vertexColors,
                color: 0x000000
            });
        }
    }

    dispose() {
        this.resources.dispose();
    }
}