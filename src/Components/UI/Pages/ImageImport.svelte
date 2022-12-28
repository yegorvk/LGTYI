<script lang="ts">
    import {UIEventsHandler} from "../UIEventsHandler";
    import Param from "../Param/Param.svelte";
    import type {GrayscaleColor} from "../../../types/GrayscaleColor";
    import {DefaultGeneratorOptions} from "../../../Terrain/GeneratorOptions";

    export let eventHandler: UIEventsHandler;
    let imp = () => {eventHandler.ImageImport(isAlphaMod, isColorMode, {r: red, b: blue, g: green}, grayscaleColor, waterLevel, isInvertedAlphaMod);};
    let isAlphaMod: boolean = false;
    let isColorMode: boolean = false;
    let isInvertedAlphaMod: boolean = false;
    let red: number = 0;
    let blue: number = 0;
    let green: number = 0;
    let waterLevel: number = DefaultGeneratorOptions.waterLevel;
    let grayscaleColor: GrayscaleColor = "red";
    function onColor(){
        isColorMode = !isColorMode;
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
        <div class="check-label">
            <label for="importColorMode">Color Mode:</label>
            <input id="importColorMode"
                   type="checkbox"
                   on:change={onColor}
            />
        </div>

        <label for="importColorRed" class:not_enabled={isColorMode===false}>Red: {red}</label>
        <input id="importColorRed"
               disabled={isColorMode===false}
               class="basic-range"
               type="range"
               bind:value={red}
               max="255"
               min="1"
        />

        <label for="importColorBlue" class:not_enabled={isColorMode===false}>Blue: {blue}</label>
        <input id="importColorBlue"
               disabled={isColorMode===false}
               class="basic-range"
               type="range"
               bind:value={blue}
               max="255"
               min="1"
        />

        <label for="importColorGreen" class:not_enabled={isColorMode===false}>Green: {green}</label>
        <input id="importColorGreen"
               disabled={isColorMode===false}
               class="basic-range"
               type="range"
               bind:value={green}
               max="255"
               min="1"
        />
    </Param>

    <Param>
        <div class="check-label">
            <label for="importAlphaMode">Alpha Mode:</label>
            <input id="importAlphaMode"
                   type="checkbox"
                   on:change={onAlpha}
            />
        </div>

        <div class="check-label">
            <label for="importInvertedMode">Inverted Mode:</label>
            <input id="importInvertedMode"
                   type="checkbox"
                   on:change={onInverted}
            />
        </div>
    </Param>

    <Param>
        <span>Grayscale is taken from:</span>
        <div class="colors_selector_import">
            <div class="color_radio">
                <label for="importColorsSelectorRed">Red</label>
                <input id="importColorsSelectorRed"
                       type="radio"
                       value="red"
                       bind:group={grayscaleColor}
                />
            </div>

            <div class="color_radio">
                <label for="importColorsSelectorBlue">Blue</label>
                <input id="importColorsSelectorBlue"
                       type="radio"
                       value="blue"
                       bind:group={grayscaleColor}
                />
            </div>

            <div class="color_radio">
                <label for="importColorsSelectorGreen">Green</label>
                <input id="importColorsSelectorGreen"
                       type="radio"
                       value="green"
                       bind:group={grayscaleColor}
                />
            </div>
        </div>
    </Param>

    <Param>
        <label for="importWaterLevel">water level: {waterLevel}</label>
        <input id="importWaterLevel"
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