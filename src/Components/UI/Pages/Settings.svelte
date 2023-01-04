<script lang="ts">
    import Param from "../Param/Param.svelte";
    import type {UIEventsHandler} from "../UIEventsHandler";
    import {DefaultRenderSettings} from "../../../Renderer/RenderSettings";

    export let is2D: boolean = false;
    export let eventHandler: UIEventsHandler;

    let wireframeOpacity = eventHandler.renderSettings[1];
    let wireframeLineWidth = eventHandler.renderSettings[2];
    let dynamicScene: boolean = eventHandler.renderSettings[3];
    let mode = eventHandler.renderSettings[0];
    let colors = eventHandler.renderSettings[4].concat();
    for (let i = 0; i < colors.length; i++){
        colors[i] = colors[i].toString(16);
        colors[i] = '#' + colors[i];
    }

    function dimSwitch() {
        is2D = !is2D;
    }

    let save = () => {
        eventHandler.settingsSave(mode, wireframeLineWidth, wireframeOpacity, dynamicScene, colors);
    }
    let dynSwitch = () => {
        dynamicScene = !dynamicScene
    };
    let fontSwitch = () => {
        eventHandler.FontSwitch()
    };
    const defaultColor = "#000000";
    let colorAdd = () => {
        colors.push(defaultColor);
        colors = colors;
    }


</script>

<div>
    <button class="menu-but center-text" on:click={dimSwitch}>
        <span>2D ⟷ 3D</span>
    </button>

    <div class:hidden={!is2D}>
        <button class="menu-but center-text"
                on:click={
                    () => {
                        eventHandler.d2SettingsSwitch();
                    }
                }>
            <span>Grayscale ⟷ Color</span>
        </button>
    </div>

    <div class:hidden={is2D}>
        <Param>
            <label for="wireframeOpacity">Wireframe Opacity: {wireframeOpacity}</label>
            <input id="wireframeOpacity"
                   class="basic-range"
                   type="range"
                   bind:value={wireframeOpacity}
                   max="1"
                   min="0"
                   step="0.05"
            />
        </Param>

        <Param>
            <label for="wireframeLineWidth">Wireframe Sickness: {wireframeLineWidth}</label>
            <input id="wireframeLineWidth"
                   class="basic-range"
                   type="range"
                   bind:value={wireframeLineWidth}
                   max="10"
                   min="1"
            />
        </Param>
        <Param>
            <label>Dynamic Scene</label>
            <input
                    type="checkbox"
                    on:click={dynSwitch}
                    checked={dynamicScene}
                    value={dynamicScene}
            />
        </Param>
        <Param>
            <div class="check-label">
                <label for="modeLightning">Lighting:</label>
                <input id="modeLightning"
                       type="checkbox"
                       value={"1"}
                       bind:group={mode}
                />
            </div>

            <div class="check-label">
                <label for="modeWireframe">Wireframe:</label>
                <input id="modeWireframe"
                       type="checkbox"
                       value={"2"}
                       bind:group={mode}
                />
            </div>

            <div class="check-label">
                <label for="modeGradient">Gradient:</label>
                <input id="modeGradient"
                       type="checkbox"
                       value={"3"}
                       bind:group={mode}
                />
            </div>
        </Param>
        <button class="menu-but center-text" on:click={fontSwitch}>
            <span>Comfortaa ⟷ Ubuntu</span>
        </button>
    </div>
    <Param>
        <h3>Gradient colors:
            <button class="colors-button" on:click={colorAdd}>Add</button>
        </h3>
        {#each colors as color}
               <span class="colors-span"><input type="color" bind:value={color}/> <button class="colors-button" on:click={()=>{
                   let index = colors.indexOf(color);
                   colors.splice(index, 1);
                   colors = colors;
               }}>Remove</button></span>

        {/each}
    </Param>

    <button class="menu-but center-text" on:click={save}>
        <span>Save</span>
    </button>
</div>