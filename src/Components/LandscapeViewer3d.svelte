<script lang="ts">
    import * as THREE from 'three'
    import { onDestroy, onMount } from 'svelte'
    import { FlyControls } from 'three/examples/jsm/controls/FlyControls'
    import { CustomFlyControls } from '../CustomFlyControls'
    import { Chunk } from '../Terrain/Chunk'; 
    import type { Heightmap } from '../Terrain/Heightmap';
    import { RenderChunk } from '../Renderer/RenderChunk'
    import { Terrain } from '../Terrain/Terrain';
    import { RenderTerrain } from '../Renderer/RenderTerrain';
    import { DefaultRenderSettings, type RenderSettings } from '../Renderer/RenderSettings';

    let root: Element;
    export let heightmap: Heightmap;
    export let renderSettings: RenderSettings = DefaultRenderSettings;

    let renderer: THREE.WebGLRenderer = null;
    let camControls: FlyControls = null;
    let camControlsChangeEventListener: () => any = null;
    let windowResizeEventListener: () => any = null;

    let clock = new THREE.Clock()

    let scene = new THREE.Scene()
    let camera: THREE.PerspectiveCamera = null;

    let chunk = new Chunk(1, heightmap, renderSettings.gradient)

    let renderChunk = new RenderChunk(
        new THREE.Vector3(0, 0, 0),
        chunk,
        {
            useWireframe: renderSettings.wireframe,
            wireframeLineWidth: renderSettings.wireframeLineWidth,
            wireframeOpacity: renderSettings.wireframeOpacity,
            prepareForLighting: renderSettings.lighting,
            vertexColors: renderSettings.gradient
        }
    )

    scene.add(renderChunk)

    let waterLayerNorm: THREE.Texture = null;

    if (renderSettings.lighting) {
        const waterLayerGeometry = new THREE.PlaneGeometry(
            chunk.width-1,
            chunk.height-1
        )

        waterLayerGeometry.translate(0, 0, heightmap.waterLevel)

        /*waterLayerNorm = new THREE.TextureLoader().load(
            "assets/textures/water_norm.",
        )

        waterLayerNorm.minFilter = THREE.LinearFilter;
        waterLayerNorm.magFilter = THREE.LinearFilter;
        waterLayerNorm.wrapS = THREE.RepeatWrapping;
        waterLayerNorm.wrapT = THREE.RepeatWrapping;

        waterLayerNorm.repeat.set(1, 1)
        waterLayerNorm.generateMipmaps = true;*/

        const waterLayerMat = new THREE.MeshBasicMaterial(
            {
                transparent: true,
                opacity: 0.6,
                //shininess: 0.9,
                reflectivity: 0.9,
                color: 0x064273,
                //specular: 0xFFFFFF,
                //normalMap: waterLayerNorm,
            }
        )

        const waterLayer = new THREE.Mesh(waterLayerGeometry, waterLayerMat)
        scene.add(waterLayer)

        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1)
        scene.add(ambientLight)

        const sunLight = new THREE.DirectionalLight( 0xffffff, 0.7);
        sunLight.position.set(0, 0, 200)

        scene.add(sunLight)
    }

    function animate() {
            if (renderer === null) return;
            renderer.render(scene, camera)
        }

    function update() {
        if (camControls === null) return;
        camControls.update(clock.getDelta())
        requestAnimationFrame(update)
    }

    onMount(() => {
        const rootWidth = root.clientWidth
        const rootHeight = root.clientHeight

        camera = new THREE.PerspectiveCamera(
            75, // fov
            rootWidth / rootHeight, // aspect ratio
            0.1, // near
            1000 // far
        )

        camera.position.set(0, 0, 50)
        camera.lookAt(0, 0, 0)

        if (renderer !== null)
            renderer.dispose()

        renderer = new THREE.WebGLRenderer({
            canvas: root,
            antialias: true,
            alpha: true
        });

        renderer.setSize(rootWidth, rootHeight)

        windowResizeEventListener = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight);
        }

        window.addEventListener('resize', windowResizeEventListener)

        if (camControls !== null)
            camControls.dispose()

        camControls = new FlyControls(camera, renderer.domElement)
        camControls.dragToLook = true

        camControls.movementSpeed *= 40
        camControls.rollSpeed *= 100

        update()
        animate()

        camControlsChangeEventListener = () => {
            animate()
        }

        camControls.addEventListener('change', camControlsChangeEventListener)
    })

    onDestroy(() => {
        if (renderer !== null) {
            renderer.dispose()
            renderer = null
        }

        if (camControls !== null) {
            camControls.removeEventListener('change', camControlsChangeEventListener)
            camControlsChangeEventListener = null;
            camControls.dispose()
            camControls = null
        }

        window.removeEventListener('resize', windowResizeEventListener)
        windowResizeEventListener = null;

        if (waterLayerNorm !== null)
            waterLayerNorm.dispose()

        clock.stop();

        waterLayerNorm = clock = scene = camera = chunk = renderChunk = null;
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