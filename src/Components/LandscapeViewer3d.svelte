<script lang="ts">
    import * as THREE from 'three'
    import { onMount } from 'svelte'
    import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
    import { Chunk } from '../Terrain/Chunk'; 
    import { Heightmap } from '../Terrain/Heightmap';
    import { RenderChunk } from '../Renderer/RenderChunk'
    import { Terrain } from '../Terrain/Terrain';
    import { RenderTerrain } from '../Renderer/RenderTerrain';
    import { DefaultGeneratorOptions, type GeneratorOptions } from '../Terrain/GeneratorOptions';

    let root: Element;

    export let heightmap: Heightmap;
    // terrain generation options
    export let generatorOptions: GeneratorOptions = DefaultGeneratorOptions

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

        camControls.dragToLook = true

        camControls.movementSpeed *= 40
        camControls.rollSpeed *= 100

        console.log(generatorOptions)

        heightmap = Heightmap.generate(generatorOptions)

        const chunk = new Chunk(generatorOptions.size, heightmap)
        const renderChunk = new RenderChunk(
            new THREE.Vector3(0, 0, 0),
            chunk
        )

        scene.add(renderChunk)

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1)
        scene.add(ambientLight)

        const sunLight = new THREE.DirectionalLight( 0xffffff, 0.7);
        sunLight.position.set(0, 0, 200)
        scene.add(sunLight)

        function animate() {
            renderer.render(scene, camera)
        }

        function update() {
            camControls.update(clock.getDelta())
            requestAnimationFrame(update)
        }

        update()
        animate()

        camControls.addEventListener('change', () => {
            animate()
        })
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