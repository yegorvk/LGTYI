<script lang="ts">
    import {
        Canvas,
        Scene,
        PerspectiveCamera,
        DirectionalLight,
        AmbientLight,
        BoxBufferGeometry,
        Mesh,
        MeshStandardMaterial,
        WebGLRenderer,
        Vector3,
        Geometry,
        BufferGeometry,
        MeshBasicMaterial,
        BufferAttribute,
        InterleavedBufferAttribute,
        InterleavedBuffer,
        ShaderMaterial
    } from "svelthree";
    import Camera from "./Components/Camera.svelte"

    import { vShader, fShader } from './shaders/simpleShader'

    const geometry = new BufferGeometry();

    const vertices = new Float32Array( [
         // position (x, y, z)  // color (rgb)
        -1.0,  1.0,  1.0,       1.0, 0.0, 0.0,
         1.0, -1.0,  1.0,       0.0, 1.0, 0.0,
         1.0,  1.0,  1.0,       0.0, 0.0, 1.0,

        -1.0,  1.0,  1.0,       1.0, 0.0, 0.0,
        -1.0, -1.0,  1.0,       0.0, 0.0, 1.0,
         1.0, -1.0,  1.0,       0.0, 1.0, 0.0
    ] );

    const vertex_buff = new InterleavedBuffer( vertices, 6 );

    geometry.setAttribute( 
        'position',
        new InterleavedBufferAttribute( vertex_buff, 3, 0 ) 
    );

    geometry.setAttribute(
        'color',
        new InterleavedBufferAttribute( vertex_buff, 3, 3 )
    );

    const material = new ShaderMaterial( {
        uniforms: {},
        vertexShader: vShader,
        fragmentShader: fShader,
    } );

</script>

<main>
    <Canvas let:sti w={window.innerWidth} h={window.innerHeight}>

        <Scene {sti} let:scene id="main_scene" props={{ background: 0xedf2f7 }}>

            <Camera {scene}></Camera>
           <!--<AmbientLight {scene} intensity={1.25} />-->
            <!--<DirectionalLight {scene} pos={[3, 3, 3]} />-->

            <Mesh
                    {scene}
                    geometry={geometry}
                    material={material}
                    mat={{ roughness: 0.5, metalness: 0.5, color: 0xff3e00 }}
                    pos={[0, 0, 0]}
                    scale={[1, 1, 1]}
                    aniauto />

        </Scene>

        <WebGLRenderer
                {sti}
                sceneId="main_scene"
                camId="main_camera"
                config={{ antialias: true, alpha: true }} />     

    </Canvas>
</main>

<style>


</style>