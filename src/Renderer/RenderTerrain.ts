import * as THREE from 'three'
import type {Terrain} from '../Terrain/Terrain'
import {DefaultRenderOptions, type RenderOptions} from './RenderOptions'
import {applyDefaults} from '../Defaults'
import {Vector3} from 'three'
import {RenderChunk} from './RenderChunk'

export class RenderTerrain extends THREE.Object3D {
    constructor(terrain: Terrain, options: RenderOptions = DefaultRenderOptions) {
        super()

        applyDefaults(options, DefaultRenderOptions)

        const offsetDelta = terrain.chunkScale
        let offsetX = 0, offsetY = 0

        for (let i = 0; i < terrain.chunkGridSize; i++) {
            for (let j = 0; j < terrain.chunkGridSize; j++) {
                const base = i * terrain.chunkGridSize + j
                const chunk = new RenderChunk(
                    new THREE.Vector3(offsetX, offsetY, 0),
                    terrain.chunks[base],
                    options
                )

                super.add(chunk)

                offsetX += offsetDelta
            }

            offsetX = 0
            offsetY += offsetDelta
        }
    }
}