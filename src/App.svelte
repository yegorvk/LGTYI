<script lang="ts">
    import LandScapeViewer3d from './Components/LandscapeViewer3d.svelte'
    import UI from "./Components/UI.svelte";
    import { DefaultGeneratorOptions, type GeneratorOptions } from './Terrain/GeneratorOptions';
    import Renderer2D from "./Components/Renderer2D.svelte";
    import {Heightmap} from "./Terrain/Heightmap";
    import {exportMap} from "./Terrain/Exporter";

    let generatorOptions = DefaultGeneratorOptions
    let trigger: boolean;
    let is2DView:boolean = false;
    let HeightMap: Heightmap;
    let d2VScale: number;
    const generate = (options: GeneratorOptions) => {
        generatorOptions = options
        trigger = !trigger
    }

    function exp(){
        exportMap(Heightmap)
    }
</script>

<main id="app_content">
    <UI {generate} bind:d2VScale={d2VScale} bind:is2D = {is2DView} on:export_map={exp}/>
    {#if !is2DView}
    {#key trigger}
    <LandScapeViewer3d {generatorOptions} bind:heightmap = {HeightMap}/>
    {/key}
    {:else}
        <div
             class="d2-cont"
             >

            <Renderer2D d2Scale={d2VScale} data={HeightMap}></Renderer2D>
        </div>
    {/if}
</main>
 
<style>

#app_content {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.d2-cont{
    width: 100%;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
    overflow:auto;
}


</style>