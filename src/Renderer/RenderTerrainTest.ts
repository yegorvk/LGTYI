import * as THREE from 'three';
import type { Heightmap } from '../Terrain/Heightmap';
import { vertex as terrainVertex, fragment as terrainFragment } from '../shaders/terrain.glsl';
import { colorRGBFromAltitude } from '../Terrain/PointColor';

export class RenderTerrainTest extends THREE.Object3D {
    constructor(heightmap: Heightmap) {
        super();

        const geometry = new THREE.PlaneGeometry(
            heightmap.width-1,
            heightmap.height-1,
            (heightmap.width-1) / 2,
            (heightmap.height-1) / 2
        );

        geometry.computeVertexNormals();

        const mat = this.createMaterial(heightmap);

        const mesh = new THREE.Mesh(geometry, mat);
        this.add(mesh);
    }

    private createMaterial(heightmap: Heightmap) {
        const uniforms = THREE.UniformsUtils.merge([
            THREE.ShaderLib.phong.uniforms,
            { 
                shininess: { value: 0.2 },
                zTexture: { value: this.createHeightTex(heightmap) },
                offset: { value: new THREE.Vector2(0, 0) },
                scale: { value: new THREE.Vector2(heightmap.width, heightmap.height) }
            },
        ]);

        const mat = new THREE.ShaderMaterial({
            vertexShader: terrainVertex,
            fragmentShader: terrainFragment,
            uniforms: uniforms,
            lights: true,
            vertexColors: false,
            name: 'custom-terrain-material'
        });

        return mat;
    }

    private createHeightTex(heightmap: Heightmap): THREE.Texture {
        const heightmapTex = new THREE.DataTexture(
            heightmap.data,
            heightmap.width,
            heightmap.height,
            THREE.RedFormat,
            THREE.FloatType,
            THREE.UVMapping,
            THREE.ClampToEdgeWrapping,
            THREE.ClampToEdgeWrapping,
            THREE.LinearFilter,
            THREE.LinearFilter,
            undefined,
            THREE.LinearEncoding,
        );

        heightmapTex.generateMipmaps = false;
        heightmapTex.needsUpdate = true;

        return heightmapTex;
    }
}