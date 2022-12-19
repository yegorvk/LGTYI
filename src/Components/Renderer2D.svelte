<script lang="ts">

    import type {Heightmap} from "../Terrain/Heightmap";
    import {DefaultGeneratorOptions} from "../Terrain/GeneratorOptions";
    import {onMount} from "svelte";
    import {colorGrayScaleFromAltitude, rgbFromGrayScale} from "../Terrain/PointColor";

    let canvas: HTMLCanvasElement;
    export let data: Heightmap;
    export let d2Scale: number = 5;
    onMount(()=>{
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        for (let i=0; i < data.size; i++){
            for (let j = 0; j < data.size; j++){
                let id = j + i * data.size;
                let grayscale = colorGrayScaleFromAltitude(data.data[id]);
                let rgb = rgbFromGrayScale(grayscale)
                context.fillStyle = `#${rgb.toString(16)}`;
                context.fillRect(i*5, j*5, 5, 5);
            }
        }
    })

</script>

<canvas
        bind:this={canvas}
        width={data.size*d2Scale}
        height={data.size*d2Scale}
>

</canvas>