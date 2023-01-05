import * as THREE from 'three'
import {applyDefaults} from '../Defaults'
import type {Chunk} from '../Terrain/Chunk'
import {type RenderOptions, DefaultRenderOptions} from './RenderOptions'
import { ResourceManager } from './ResourceManager';
import * as terrainShaders from '../Shaders/terrain.glsl';
import { MAX_ALT, MIN_ALT } from '../Generator/GeneratorOptions';

/** Terrain object in the three.js scene graph */
export class RenderChunk extends THREE.Object3D {
    private readonly terrainScale: number = null;

    private readonly terrainNormal: THREE.Texture = null;
    private readonly rockTexture: THREE.Texture = null;
    private readonly grassTexture: THREE.Texture = null;
    private readonly snowTexture: THREE.Texture = null;

    private readonly resources: ResourceManager = new ResourceManager();

    constructor(offset: THREE.Vector3, scale: number, chunk: Chunk, options: RenderOptions = DefaultRenderOptions) {
        super()

        applyDefaults(options, DefaultRenderOptions);

        if (options.vertexColors || options.textures) {
            this.terrainNormal = new THREE.TextureLoader().load('assets/textures/terrain_bump.jpg');
            this.resources.register(this.terrainNormal);

            adjustTerrainTexture(this.terrainNormal);
        }

        if (options.textures) {
            this.rockTexture = new THREE.TextureLoader().load('assets/textures/terrain_rock.jpg');
            this.resources.register(this.rockTexture);

            this.snowTexture = new THREE.TextureLoader().load('assets/textures/terrain_snow1.jpg');
            this.resources.register(this.snowTexture);

            this.grassTexture = new THREE.TextureLoader().load('assets/textures/terrain_grass0.jpg');
            this.resources.register(this.grassTexture);

            adjustTerrainTexture(this.rockTexture);
            adjustTerrainTexture(this.grassTexture);
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
                    bumpMap: { value: (this.terrainNormal !== null) ? this.terrainNormal : undefined },
                    grassTex: { value: (this.grassTexture !== null) ? this.grassTexture : undefined },
                    rockTex: { value: (this.rockTexture !== null) ? this.rockTexture : undefined },
                    snowTex: { value: (this.snowTexture !== null) ? this.snowTexture : undefined },
                    //map: { value: (this.rockTexture !== null) ? this.rockTexture : undefined },
                    shininess: { value: 0.1 },
                    maxZ: { value: MAX_ALT * this.terrainScale * 2 },
                    minZ: { value: MIN_ALT * this.terrainScale * 2 }
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

function adjustTerrainTexture(texture: THREE.Texture) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;

    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    texture.generateMipmaps = true;
}