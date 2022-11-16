<script lang="ts">
    import {PerspectiveCamera, Vector3} from "svelthree";
    import PerspectiveCameraRemake from "./PerspectiveCameraRemake.svelte";

    let cameraPos: Vector3 = new Vector3(0, 0, 3);
    let cameraLook: Vector3 = new Vector3(0, 0, 0);


    let camera: PerspectiveCamera;
    export let scene;



    setInterval(()=>{camera.rotation.x = 6.28}, 10);
    function handleMouseMove(e){

    }
</script>


<PerspectiveCameraRemake on:mousemove={handleMouseMove} bind:cam={camera} {scene} id="main_camera" pos={cameraPos} lookAt={cameraLook}/>