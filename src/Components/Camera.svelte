<script lang="ts">
    import {PerspectiveCamera, Vector3} from "svelthree";

    export let scene;

    let cameraPos: Vector3 = new Vector3(0, 0, 3);
    let cameraLook: Vector3 = new Vector3(0, 0, 0);
    setInterval(()=>{cameraPos = new Vector3(0, 0, cameraPos.z - 0.1)}, 100);
</script>


<PerspectiveCamera {scene} id="main_camera" pos={cameraPos} lookAt={cameraLook}/>