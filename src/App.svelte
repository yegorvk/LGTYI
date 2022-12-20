<script lang="ts">
    import LandScapeViewer3d from './Components/LandscapeViewer3d.svelte'
<<<<<<< HEAD
    import UI from "./Components/UI.svelte";
    import {DefaultGeneratorOptions, type GeneratorOptions} from './Terrain/GeneratorOptions';
=======
    import UI from "./Components/UI/UI.svelte";
    import { DefaultGeneratorOptions, type GeneratorOptions } from './Terrain/GeneratorOptions';
>>>>>>> 165e36c78c3a79ce5288636078bd6fa0d5e407ea
    import Renderer2D from "./Components/Renderer2D.svelte";
    import {Heightmap} from "./Terrain/Heightmap";
    import {exportMap} from "./Terrain/Exporter";

    let trigger: boolean;
<<<<<<< HEAD
    let is2DView: boolean = false;
    let HeightMap: Heightmap;
=======
    let is2DView:boolean = false;
    let heightmap: Heightmap = Heightmap.generate(DefaultGeneratorOptions);
>>>>>>> 165e36c78c3a79ce5288636078bd6fa0d5e407ea
    let d2VScale: number;

<<<<<<< HEAD
    function exp() {
        exportMap(Heightmap)
=======
    const generate = (options: GeneratorOptions) => {
        heightmap = Heightmap.generate(options)        
        trigger = !trigger
>>>>>>> 165e36c78c3a79ce5288636078bd6fa0d5e407ea
    }
</script>

<main id="app_content">
<<<<<<< HEAD
    <UI {generate} bind:d2VScale={d2VScale} bind:is2D={is2DView} on:export_map={exp}/>
    {#if !is2DView}
        {#key trigger}
            <LandScapeViewer3d {generatorOptions} bind:heightmap={HeightMap}/>
        {/key}
    {:else}
        <div
                class="d2-cont"
        >

            <Renderer2D d2Scale={d2VScale} data={HeightMap}></Renderer2D>
=======
    <UI {generate} bind:d2VScale={d2VScale} bind:is2D = {is2DView} on:export_map={() => {}}/>
    {#if !is2DView}
    {#key trigger}
    <LandScapeViewer3d {heightmap}/>
    {/key}
    {:else}
        <div class="d2-cont">
            {#key trigger}
            <Renderer2D d2Scale={d2VScale} data={heightmap}></Renderer2D>
            {/key}
>>>>>>> 165e36c78c3a79ce5288636078bd6fa0d5e407ea
        </div>
    {/if}
</main>

<style>

    #app_content {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }

    .d2-cont {
        width: 100%;
        height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
    }

</style>