<script lang="ts">
    import {PerspectiveCamera, Vector3} from "svelthree";
    import PerspectiveCameraRemake from "./PerspectiveCameraRemake.svelte";
    import FlyControls from "../misc/FlyControls";
    import {onMount} from "svelte";
    let cameraPos: Vector3 = new Vector3(0, 0, 3);
    let cameraLook: Vector3 = new Vector3(0, 0, 0);


    let camera: PerspectiveCamera;
    export let scene;
    let flyControls: FlyControls;
    onMount(()=>{
        flyControls = new FlyControls(camera, document.getElementById("main"), false);
        setInterval(()=>{flyControls.update(10)}, 10);
    });

    const props: any = {
        filmOffset: 2

    }

    setInterval(()=>{camera.rotation.x = 6.28}, 10);

</script>


<PerspectiveCameraRemake props={props}  bind:cam={camera} {scene} id="main_camera" pos={cameraPos} lookAt={cameraLook}/>