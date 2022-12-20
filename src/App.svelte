<script lang="ts">
    import LandScapeViewer3d from './Components/LandscapeViewer3d.svelte'
    import UI from "./Components/UI/UI.svelte";
    import {DefaultGeneratorOptions, type GeneratorOptions} from './Terrain/GeneratorOptions';
    import Renderer2D from "./Components/Renderer2D.svelte";
    import {Heightmap} from "./Terrain/Heightmap";
    import {exportMap} from "./Files/Exporter";
    import {importMap} from "./Files/Importer";

    let trigger: boolean;
    let is2DView: boolean = false;
    let heightmap: Heightmap = Heightmap.generate(DefaultGeneratorOptions);
    
    const generate = (options: GeneratorOptions) => {
        heightmap = Heightmap.generate(options)
        trigger = !trigger
    }

    async function ImportMap(){
        heightmap = await importMap();
        heightmap = heightmap
    }
</script>

<main id="app_content">
    <UI {generate} bind:d2VScale={d2VScale} bind:is2D={is2DView} on:export_map={() => {exportMap(heightmap)}} on:import_map={()=>{ImportMap()}}/>

</script>

<main id="app_content">
    <UI {generate} bind:is2D={is2DView} on:export_map={() => {exportMap(heightmap)}}/>

    {#if !is2DView}
        {#key trigger}
            <LandScapeViewer3d {heightmap}/>
        {/key}
    {:else}
        <div class="d2-cont">
            {#key trigger}
                <Renderer2D data={heightmap}></Renderer2D>
            {/key}
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