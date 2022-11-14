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
        Vector3, Geometry, BufferGeometry, MeshBasicMaterial, BufferAttribute
    } from "svelthree";

    const geometry = new BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        -0.5, -0.5,  1.0,
         1.0, -1.0,  1.0,
         1.0,  1.0,  1.0,

         1.0,  1.0,  1.0,
        -1.0,  1.0,  1.0,
        -0.5, -0.5,  1.0
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
    const material = new MeshBasicMaterial( { color: 0xff0000 } );

</script>

<main>
    <Canvas let:sti w={window.innerWidth} h={window.innerHeight}>

        <Scene {sti} let:scene id="scene1" props={{ background: 0xedf2f7 }}>

            <PerspectiveCamera {scene} id="cam1" pos={[0, 0, 3]} lookAt={[0, 0, 0]} />
            <AmbientLight {scene} intensity={1.25} />
            <DirectionalLight {scene} pos={[3, 3, 3]} />

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
                sceneId="scene1"
                camId="cam1"
                config={{ antialias: true, alpha: true }} />

    </Canvas>
</main>

<style>


</style>