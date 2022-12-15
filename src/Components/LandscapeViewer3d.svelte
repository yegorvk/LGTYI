<script lang="ts">
    import * as THREE from 'three'
    import { onMount } from 'svelte'
    import { RenderChunk } from '../Renderer/RenderChunk';
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls' 

    let root: Element;

    onMount(() => {
        const rootWidth = root.clientWidth
        const rootHeight = root.clientHeight
        
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(
            75, // fov
            rootWidth / rootHeight, // aspect ratio
            0.1, // near
            1000 // far
        )

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setSize(rootWidth, rootHeight)

        root.appendChild(renderer.domElement)

        const controls = new OrbitControls(camera, renderer.domElement)

        camera.position.set(0, 0, 50)
        camera.lookAt(0, 0, 0)

        controls.update()

        const chunk = new RenderChunk(100, 500)

        const terrainGeometry = new THREE.BufferGeometry()

        const posAttr = new THREE.BufferAttribute(chunk.vertices, 3)
        terrainGeometry.setAttribute('position', posAttr)

        const indexAttr = new THREE.BufferAttribute(chunk.indices, 1)
        terrainGeometry.setIndex(indexAttr)

        const terrainWireframe = new THREE.WireframeGeometry(terrainGeometry)

        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            linewidth: 1.3
        })

        const meshMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000
        })

        const line = new THREE.LineSegments(terrainWireframe, lineMaterial)
        const mesh = new THREE.Mesh(terrainGeometry, meshMaterial)

        line.material.depthTest = true
        mesh.material.depthTest = true

        mesh.renderOrder = 1
        line.renderOrder = 2

        scene.add(mesh)
        scene.add(line)

        function animate() {
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }

        animate()
    })
</script>

<main id="landscape_viewer3d" bind:this={root}/>

<style>

#landscape_viewer3d {
    width: 100%;
    height: 100%;
    background-color: black;
}

</style>