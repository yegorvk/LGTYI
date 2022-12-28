<script lang="ts">
    import Param from "../Param/Param.svelte";
    import type {UIEventsHandler} from "../UIEventsHandler";
    import {DefaultRenderSettings} from "../../../Renderer/RenderSettings";

    export let is2D: boolean = false;
    export let eventHandler: UIEventsHandler;
    let wireframeOpacity = DefaultRenderSettings.wireframeOpacity;
    let wireframeLineWidth = DefaultRenderSettings.wireframeLineWidth;
    let mode = ["1", "2", "3"];
    function dimSwitch() {
        is2D = !is2D;
        is2D = is2D;
    }
    let save = () => {eventHandler.settingsSave(mode, wireframeLineWidth, wireframeOpacity);}
</script>

<div>
    <button class="menu-but" on:click={dimSwitch}>
        <span>2D ⟷ 3D</span>
    </button>

    <div class:hidden={!is2D}>
        <button class="menu-but"
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
            <span>Wireframe Opacity: {wireframeOpacity}</span>
            <input class="basic-range"
                   type="range"
                   bind:value={wireframeOpacity}
                   max="1"
                   min="0"
                   step="0.05"
            />
        </Param>

        <Param>
            <span>Wireframe Sickness: {wireframeLineWidth}</span>
            <input class="basic-range"
                   type="range"
                   bind:value={wireframeLineWidth}
                   max="10"
                   min="1"
            />
        </Param>

        <Param>
            <div class="check-label">
                <span>Lighting:</span>
                <input type="checkbox"
                       value={"1"}
                       bind:group={mode}
                />
            </div>

            <div class="check-label">
                <span>Wireframe:</span>
                <input type="checkbox"
                       value={"2"}
                       bind:group={mode}
                />
            </div>

            <div class="check-label">
                <span>Gradient:</span>
                <input type="checkbox"
                       value={"3"}
                       bind:group={mode}
                />
            </div>
        </Param>
    </div>

    <button class="menu-but" on:click={save}>
        <span>Save</span>
    </button>
</div>