<script lang="ts">
    import * as THREE from "three";
    import { onDestroy, onMount } from "svelte";
    import { FlyControls } from "three/examples/jsm/controls/FlyControls";
    import { Chunk } from "../Terrain/Chunk";
    import type { Heightmap } from "../Terrain/Heightmap";
    import { RenderChunk } from "../Renderer/RenderChunk";
    import {
        DefaultRenderSettings,
        type RenderSettings,
    } from "../Renderer/RenderSettings";
    import * as water from '../Shaders/water.glsl';
    import { applyDefaults } from "../Defaults";
    import { ResourceManager } from "../Renderer/ResourceManager";
    import { MIN_ALT } from "../Generator/GeneratorOptions";

    let root: HTMLCanvasElement;

    export let onPrepare: () => Promise<void>;
    export let onReady: () => Promise<void>;

    export let useOrthographicCamera: boolean = false;

    export let heightmap: Heightmap;
    export let renderSettings: RenderSettings = DefaultRenderSettings;

    applyDefaults(renderSettings, DefaultRenderSettings);

    const SCALE = 1;

    let resources = new ResourceManager();

    let camControlsChangeEventListener: () => any = null;
    let windowResizeEventListener: () => any = null;
    let keydownEventListener: (e: KeyboardEvent) => any = null;
    let keyupEventListener: (e: KeyboardEvent) => any = null;

    let clock = new THREE.Clock();
    let scene = new THREE.Scene();

    let chunk = new Chunk(2, heightmap, true, renderSettings.gradientSettings);

    let waterLayerShaderMat: THREE.ShaderMaterial = null;

    if (renderSettings.lighting) {
        const waterLayerGeometry = new THREE.PlaneGeometry(
            (heightmap.width - 1) * SCALE * 2,
            (heightmap.height - 1) * SCALE * 2,
            1,
            1
        );

        resources.register(waterLayerGeometry);

        waterLayerGeometry.translate(0, 0, heightmap.waterLevel);

        const waterLayerNorm = new THREE.TextureLoader().load('./assets/textures/water_norm.jpg');
        const waterLayerNorm1 = new THREE.TextureLoader().load('./assets/textures/water_norm1.jpg');

        resources.register(waterLayerNorm);
        resources.register(waterLayerNorm1);

        waterLayerNorm.wrapS = THREE.RepeatWrapping;
        waterLayerNorm.wrapT = THREE.RepeatWrapping;

        waterLayerNorm1.wrapS = THREE.RepeatWrapping;
        waterLayerNorm1.wrapT = THREE.RepeatWrapping;

        const uniforms = THREE.UniformsUtils.merge([
            THREE.ShaderLib.phong.uniforms,
            {
                diffuse: { value: new THREE.Color(0x064273) },
                opacity: { value: 0.45 },
                normalMap: { value: waterLayerNorm },
                normalMap1: { value: waterLayerNorm1 },
                time: { value: 0.0 }
            }
        ]);

        if (heightmap.waterLevel >= MIN_ALT) {
            let waterLayerMat: THREE.Material;

            if (renderSettings.dynamicScene) {
                waterLayerMat = new THREE.ShaderMaterial(
                    {
                        vertexShader: water.vertex,
                        fragmentShader: water.fragment,
                        lights: true,
                        uniforms: uniforms,
                        transparent: true,
                    }
                );

                waterLayerShaderMat = waterLayerMat as THREE.ShaderMaterial;
            } else {
                waterLayerMat = new THREE.MeshPhongMaterial({
                    transparent: true,
                    opacity: 0.45,
                    color: 0x064273,
                    normalMap: waterLayerNorm,
                });
            }

            resources.register(waterLayerMat);

            const waterLayer = new THREE.Mesh(waterLayerGeometry, waterLayerMat);
            scene.add(waterLayer);
        }

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        resources.register(ambientLight);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 0.7);
        resources.register(sunLight);
        sunLight.position.set(0, 0, 200);
        scene.add(sunLight);
    }

    function loop(width: number, height: number) {
        const rootWidth = width;
        const rootHeight = height;

        const renderChunk = new RenderChunk(new THREE.Vector3(0, 0, 0), SCALE, chunk, {
            useWireframe: renderSettings.wireframe,
            wireframeLineWidth: renderSettings.wireframeLineWidth,
            wireframeOpacity: renderSettings.wireframeOpacity,
            prepareForLighting: renderSettings.lighting,
            vertexColors: renderSettings.gradient,
            textures: renderSettings.textures
        });

        resources.register(renderChunk);
        scene.add(renderChunk);

        let camera: THREE.Camera;

        if (useOrthographicCamera)
            /*camera = new THREE.OrthographicCamera(
                -width/2,
                width/2,
                -height/2,
                height/2,
                0.1,
                1000
            );*/

            camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.1, 1000);
        else {
            camera = new THREE.PerspectiveCamera(
                75, // fov
                rootWidth / rootHeight, // aspect ratio
                0.1, // near
                10000 // far
            );
        }

        camera.position.set(0, 0, 200);
        camera.lookAt(0, 0, 0);

        const renderer = new THREE.WebGLRenderer({
            canvas: root,
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: true,
            context: root.getContext('webgl2', {
                antialias: true,
                depth: true,
                alpha: true
            })
        });

        renderer.setSize(rootWidth, rootHeight);
        resources.register(renderer);

        windowResizeEventListener = () => {
            if (useOrthographicCamera) {
                /*const cam = (camera as THREE.OrthographicCamera);

                cam.left = -window.innerWidth / 2;
                cam.right = window.innerWidth / 2;
                cam.bottom = -window.innerHeight / 2;
                cam.top = window.innerHeight / 2;

                (camera as THREE.OrthographicCamera).updateProjectionMatrix();*/
            } else {
                (camera as THREE.PerspectiveCamera).aspect = window.innerWidth / window.innerHeight;
                (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
            }

            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener("resize", windowResizeEventListener);

        const camControls = new FlyControls(camera, renderer.domElement);
        camControls.dragToLook = true;

        camControls.movementSpeed *= 160;
        camControls.rollSpeed *= 120;

        resources.register(camControls);

        let speedModifier = false;
        let speedBoost = 1;

        keydownEventListener = (e) => {
            if (speedModifier) return;

            switch (e.key) {
                case 'Shift':
                    camControls.movementSpeed *= 3.5;
                    speedBoost = 3.5;
                    break;
                case 'Alt':
                    camControls.movementSpeed /= 2;
                    speedBoost = 0.5;
                    break;
                default:
                    return;
            }

            speedModifier = true;

            e.preventDefault();
            e.stopPropagation();
        };

        keyupEventListener = (e) => {
            if (!speedModifier) return;

            if (e.key == 'Alt' || e.key == 'Shift') {
                camControls.movementSpeed /= speedBoost;
                speedModifier = false;

                e.preventDefault();
                e.stopPropagation();
            }
        };

        document.addEventListener('keydown', keydownEventListener);
        document.addEventListener('keyup', keyupEventListener);

        function animate() {
            if (renderer === null || camera === null || scene === null) return;
            renderer.render(scene, camera);
        }

        function update() {
            if (camControls === null) return;
            camControls.update(clock.getDelta());

            // This function might be called after onDestroy, so make sure 
            // waterLayerShaderMat is not null.
            if (renderSettings.dynamicScene && waterLayerShaderMat !== null) {
                waterLayerShaderMat.uniforms.time.value = clock.getElapsedTime() * 1000;
                waterLayerShaderMat.uniformsNeedUpdate = true;
            }

            if (renderSettings.dynamicScene) 
                animate();

            requestAnimationFrame(update);
        }

        console.log(renderer.info);

        update();
        animate();

        camControlsChangeEventListener = () => {
            animate();
        };

        if (!renderSettings.dynamicScene) 
            camControls.addEventListener("change", camControlsChangeEventListener);
    }

    onMount(async () => {
        await onPrepare();
        loop(root.clientWidth, root.clientHeight);
        await onReady();
    });

    onDestroy(() => {
        window.removeEventListener("resize", windowResizeEventListener);
        document.removeEventListener('keydown', keydownEventListener);
        document.removeEventListener('keyup', keyupEventListener);

        clock.stop();

        windowResizeEventListener = null;
        waterLayerShaderMat = null;
        scene = null;
        chunk = null;

        resources.dispose();
        resources = null;
    });
</script>

<canvas id="landscape_viewer3d" bind:this={root} />

<style>
    #landscape_viewer3d {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: black;
    }
</style>
