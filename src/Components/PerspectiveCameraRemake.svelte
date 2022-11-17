<script lang="typescript">
    /**
     * @author Vatroslav Vrbanic @see https://github.com/vatro
     */

    import { PerspectiveCamera, CameraHelper, Scene } from "svelthree-three"
    import Camera from "svelthree/src/components/Camera.svelte"
    import { onMount } from "svelte"
    import type {
        PropPos,
        PropRot,
        PropLookAt,
        PropMatrix4
    } from "svelthree/src/utils/Sv3Types.svelte"

    export let scene: Scene
    export let id: string = undefined
    if (!id) {
        console.warn(
            "SVELTHREE > PerspectiveCamera : you have to provide an 'id' prop (not empty String) for Cameras in order to assign them to a 'WebGLRenderer' component!",
            { id: id }
        )
        throw new Error("SVELTHREE Exception (see warning above)")
    }
    export let animation: any = undefined
    export let aniauto = false
    export let pos: PropPos = undefined
    export let rot: PropRot = undefined
    export let lookAt: PropLookAt = undefined
    export let matrix: PropMatrix4 = undefined
    export let config: { [key: string]: any } = undefined
    export let props: { [key: string]: any } = undefined
    export let cam: PerspectiveCamera
    export let helper = false

    config && config.length > 0
        ?
          (cam = new PerspectiveCamera(...config))
        : (cam = new PerspectiveCamera())



    let camHelper: CameraHelper = undefined

    $: !camHelper && cam && helper ? createHelper() : null

    onMount(() => {
        console.info("SVELTHREE > onMount : " + cam.type)
        startUpdatingHelper()
        return () => {
            console.info("SVELTHREE > onDestroy : " + cam.type)
            stopUpdatingHelper()
        }
    })

    function createHelper(): void {
        camHelper = new CameraHelper(cam)
        scene.add(camHelper)
        camHelper.visible = false
        console.info("SVELTHREE > " + cam.type + " : HELPER added!", {
            camHelper: camHelper,
            scene: scene,
            total: scene.children.length
        })
    }

    let doUpdateHelper = false
    let updateHelper_rAF = 0

    function startUpdatingHelper() {
        doUpdateHelper = true
        updateHelper_rAF = requestAnimationFrame(updateHelper)
    }

    function stopUpdatingHelper(): void {
        doUpdateHelper = false
        cancelAnimationFrame(updateHelper_rAF)
    }

    function updateHelper(): void {
        if (doUpdateHelper) {
            camHelper ? camHelper.update() : null
            requestAnimationFrame(updateHelper)
        }
    }


    export function getHelper(): CameraHelper {
        return camHelper
    }

    export function getId(): string {
        return id
    }

    let camera;


</script>

<Camera
    bind:this={camera}
    {scene}
    {cam}
    {id}
    {pos}
    {rot}
    {lookAt}
    {matrix}
    {props}
    {animation}
    {aniauto} />
