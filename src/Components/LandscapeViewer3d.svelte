<script lang="ts">
    import * as THREE from 'three'
    import { onMount } from 'svelte'
    import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
    import { Chunk } from '../Terrain/Chunk'; 
    import { Heightmap } from '../Terrain/Heightmap';
    import { RenderChunk } from '../Renderer/RenderChunk'
    import { Terrain } from '../Terrain/Terrain';
    import { RenderTerrain } from '../Renderer/RenderTerrain';

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

        camera.position.set(0, 0, 50)
        camera.lookAt(0, 0, 0)

        const renderer = new THREE.WebGLRenderer({
            canvas: root,
            antialias: true,
            alpha: true
        });

        renderer.setSize(rootWidth, rootHeight)

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight);
        })

        const clock = new THREE.Clock()
        const camControls = new FlyControls(camera, renderer.domElement)

        camControls.movementSpeed *= 40
        camControls.rollSpeed *= 100

        const heightmap = Heightmap.generate(500, 0.2)
        /*const terrain = new Terrain(200, heightmap, 500 - 1)

        const renderTerrain = new RenderTerrain(terrain)
        scene.add(renderTerrain)*/

        const chunk = new Chunk(500, heightmap)
        const renderChunk = new RenderChunk(
            new THREE.Vector3(0, 0, 0),
            chunk
        )

        scene.add(renderChunk)

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.0)
        scene.add(ambientLight)

        const sunLight = new THREE.DirectionalLight( 0xffffff, 0.5);
        sunLight.position.set(0, 0, 50)
        scene.add(sunLight)

        function animate() {
            requestAnimationFrame(animate)

            camControls.update(clock.getDelta())
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