<script lang="ts">
    import LandScapeViewer3d from './Components/LandscapeViewer3d.svelte'
    import UI from "./Components/UI.svelte";
    import { DefaultGeneratorOptions, type GeneratorOptions } from './Terrain/GeneratorOptions';

    let generatorOptions = DefaultGeneratorOptions
    let trigger: boolean;

    const generate = (options: GeneratorOptions) => {
        generatorOptions = options
        trigger = !trigger
    }
</script>

<main id="app_content">
    <UI {generate}/>

    {#key trigger}
    <LandScapeViewer3d {generatorOptions}/>
    {/key}
</main>
 
<style>

#app_content {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

</style>