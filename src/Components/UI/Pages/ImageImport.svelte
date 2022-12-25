<script lang="ts">
    import {UIEventsHandler} from "../UIEventsHandler";
    import Param from "../Param/Param.svelte";

    export let eventHandler: UIEventsHandler;
    let imp = () => {eventHandler.ImageImport();};
    let isAlphaMod: boolean = false;
    let isColorMod: boolean = false;
    let red: number = 0;
    let blue: number = 0;
    let green: number = 0;
    function onColor(){
        isColorMod = !isColorMod;
    }
    function onAlpha(){
        isAlphaMod = !isAlphaMod
    }
</script>


<div>
    <Param>
        <label>Color Mod:</label>
        <input type="checkbox" on:change={onColor}/>
        <label class:not_enabled={isColorMod==false}>Red: {red}</label>
        <input disabled={isColorMod==false}
               class="basic-range"
               type="range"
               bind:value={red}
               max="255"
               min="1">
        <label class:not_enabled={isColorMod==false}>Blue: {blue}</label>
        <input disabled={isColorMod==false}
               class="basic-range"
               type="range"
               bind:value={blue}
               max="255"
               min="1">
        <label class:not_enabled={isColorMod==false}>Green: {green}</label>
        <input disabled={isColorMod==false}
               class="basic-range"
               type="range"
               bind:value={green}
               max="255"
               min="1">
    </Param>
    <Param>
        <label>Alpha Mod:</label>
        <input type="checkbox" on:change={onAlpha}/>
    </Param>
    <button class="menu-but"
            on:click={imp}>
        <span>Import</span>
    </button>
</div>