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

    function dimSwitch() {
        is2D = !is2D;
    }

    let save = () => {eventHandler.settingsSave(mode, wireframeLineWidth, wireframeOpacity, dynamicScene);}
    let dynSwitch = () => {dynamicScene = !dynamicScene};
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
    </div>

    <button class="menu-but center-text" on:click={save}>
        <span>Save</span>
    </button>
</div>