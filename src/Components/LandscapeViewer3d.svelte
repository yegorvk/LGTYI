<script lang="ts">
    import * as THREE from 'three'
    // import { WebGLRenderer } from 'three';
    import { onMount } from 'svelte'
    import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
    import { Chunk } from '../Terrain/Chunk'; 
    import { RenderChunk } from '../Renderer/RenderChunk'

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
            canvas: root,
            antialias: true,
            alpha: true
        });

        renderer.setSize(rootWidth, rootHeight)

        const controls = new OrbitControls(camera, renderer.domElement)

        camera.position.set(0, 0, 50)
        camera.lookAt(0, 0, 0)

        controls.update()

        const chunk = new Chunk(100, 500)
        const renderChunk = new RenderChunk(chunk)

        scene.add(renderChunk)

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1)

        scene.add(ambientLight)

        const sunLight = new THREE.DirectionalLight( 0xffffff, 0.5);
        sunLight.position.set(0, 0, 50)

        scene.add(sunLight)

        function animate() {
            requestAnimationFrame(animate)
            renderer.render(scene, camera)
        }

        animate()
    })
</script>

<canvas id="landscape_viewer3d" bind:this={root}/>

<style>

#landscape_viewer3d {
    width: 100%;
    height: 100%;
    background-color: black;
}

</style>