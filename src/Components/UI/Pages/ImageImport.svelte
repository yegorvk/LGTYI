<script lang="ts">
    import {UIEventsHandler} from "../UIEventsHandler";
    import Param from "../Param/Param.svelte";
    import type {GrayscaleColor} from "../../../types/GrayscaleColor";
    import {DefaultGeneratorOptions} from "../../../Terrain/GeneratorOptions";

    export let eventHandler: UIEventsHandler;
    let imp = () => {eventHandler.ImageImport(isAlphaMod, isColorMod, {r: red, b: blue, g: green}, grayscaleColor, waterLevel, isInvertedAlphaMod);};
    let isAlphaMod: boolean = false;
    let isColorMod: boolean = false;
    let isInvertedAlphaMod: boolean = false;
    let red: number = 0;
    let blue: number = 0;
    let green: number = 0;
    let waterLevel: number = DefaultGeneratorOptions.waterLevel;
    let grayscaleColor: GrayscaleColor = "red";
    function onColor(){
        isColorMod = !isColorMod;
    }
    function onAlpha(){
        isAlphaMod = !isAlphaMod;
    }
    function onInverted(){
        isInvertedAlphaMod = !isInvertedAlphaMod;
    }
</script>


<div>
    <Param>
        <span>Color Mod:</span>
        <input type="checkbox" on:change={onColor}/>
        <span class:not_enabled={isColorMod==false}>Red: {red}</span>
        <input disabled={isColorMod==false}
               class="basic-range"
               type="range"
               bind:value={red}
               max="255"
               min="1">
        <span class:not_enabled={isColorMod==false}>Blue: {blue}</span>
        <input disabled={isColorMod==false}
               class="basic-range"
               type="range"
               bind:value={blue}
               max="255"
               min="1">
        <span class:not_enabled={isColorMod==false}>Green: {green}</span>
        <input disabled={isColorMod==false}
               class="basic-range"
               type="range"
               bind:value={green}
               max="255"
               min="1">
    </Param>
    <Param>
        <span>Alpha Mod:</span>
        <input type="checkbox" on:change={onAlpha}/>
        <span>Inverted Mod:</span>
        <input type="checkbox" on:change={onInverted}/>
    </Param>
    <Param>
        <span>Grayscale is taken from:</span>
        <div class="colors_selector_import">
            <div class="color_radio">
                <span>Red</span>
                <input type="radio" value="red" bind:group={grayscaleColor}>
            </div>
            <div class="color_radio">
                <span>Blue</span>
                <input type="radio" value="blue" bind:group={grayscaleColor}>
            </div>
            <div class="color_radio">
                <span>Green</span>
                <input type="radio" value="green" bind:group={grayscaleColor}>
            </div>
        </div>
    </Param>
    <Param>
        <label for="waterLevel">water level: {waterLevel}</label>
        <input
                id="waterLevel"
                class="basic-range"
                type="range"
                bind:value={waterLevel}
                max="51"
                min="-60"
        />
    </Param>
    <button class="menu-but"
            on:click={imp}>
        <span>Import</span>
    </button>
</div>


<style>
    .colors_selector_import{
        display: flex;
        justify-content: center;
        width: 100%;
        gap: 10%;
        align-items: center;
    }
    .color_radio{
        display: flex;
        gap: 5px;
        flex-direction: column;
    }
</style>