<script lang="ts">

    import {Heightmap} from "../Terrain/Heightmap";
    import {DefaultGeneratorOptions} from "../Terrain/GeneratorOptions";
    import {onMount} from "svelte";
    import {colorGrayScaleFromAltitude} from "../Terrain/PointColor";

    let canvas: HTMLCanvasElement;
    export let data: Heightmap;
    export let d2Scale: number = 5;
    onMount(()=>{
        let context: CanvasRenderingContext2D = canvas.getContext('2d');
        for (let i=0; i < data.size; i++){
            for (let j = 0; j < data.size; j++){
                let id = j + i * data.size;
                let alpha = colorGrayScaleFromAltitude(data.data[id]);
                context.fillStyle = `rgba(0, 0, 0, ${alpha})`;
                context.fillRect(i*d2Scale, j*d2Scale, d2Scale, d2Scale);
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