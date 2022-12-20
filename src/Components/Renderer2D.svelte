<script lang="ts">
    import type {Heightmap} from "../Terrain/Heightmap";
    import {onMount} from "svelte";
    import {colorGrayScaleFromAltitude, rgbFromGrayScale} from "../Terrain/PointColor";

    let canvas: HTMLCanvasElement;
    export let data: Heightmap;
    export let d2Scale: number = 5;
    onMount(()=>{
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        canvas.onwheel = zoom;
        for (let i=0; i < data.size; i++){
            for (let j = 0; j < data.size; j++){
                let id = j + i * data.size;
                let grayscale = colorGrayScaleFromAltitude(data.data[id]);
                let rgb = rgbFromGrayScale(grayscale)
                context.fillStyle = `#${rgb.toString(16)}`;
                context.fillRect(i*d2Scale, j*d2Scale, d2Scale, d2Scale);
            }
        }
    });
    let scale = 1;
    function zoom(event) {
        event.preventDefault();

        scale += event.deltaY * -0.001;

        // Restrict scale
        scale = Math.min(Math.max(.125, scale), 8);

        // Apply scale transform
        canvas.style.transform = `scale(${scale})`;
    }

</script>

<canvas id="rendererD2"
        bind:this={canvas}
        width={data.size*d2Scale}
        height={data.size*d2Scale}
>

</canvas>