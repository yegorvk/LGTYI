<script lang="ts" xmlns="http://www.w3.org/1999/html">
    import "./UI.css";
    import "./Range.css";
    import Param from "./Param/Param.svelte";
    import {DefaultGeneratorOptions, type GeneratorOptions} from "../../Terrain/GeneratorOptions";
    import {createEventDispatcher} from "svelte";
    import {DefaultRenderSettings} from "../../Renderer/RenderSettings";
    import type {RenderSettings} from  "../../Renderer/RenderSettings";

    export let is2D: boolean = false;
    export let generate: (options: GeneratorOptions) => void = null;

    let dispatcher = createEventDispatcher();
    export let setGeneratorData = (genData: GeneratorOptions) => {
        seed = genData.seed;
        width = genData.width;
        height = genData.height;
        maxAltitude = genData.maxAltitude;
        minAltitude = genData.minAltitude;
        roughnessCoefficient = genData.roughnessCoefficient;
        levelOfDetail = genData.levelOfDetail;
    };
    //gen options
    let seed: number = 0;
    let width: number = DefaultGeneratorOptions.width;
    let height: number = DefaultGeneratorOptions.height;
    let maxAltitude: number = DefaultGeneratorOptions.maxAltitude;
    let minAltitude: number = DefaultGeneratorOptions.minAltitude;
    let roughnessCoefficient: number = DefaultGeneratorOptions.roughnessCoefficient * 100;
    let levelOfDetail: number = DefaultGeneratorOptions.levelOfDetail;
    
    //render settings
    let wireframeOpacity = DefaultRenderSettings.wireframeOpacity;
    let wireframeLineWidth = DefaultRenderSettings.wireframeLineWidth;
    let mode = ["1", "2", "3"]
    //panels visibility
    let visible: boolean = false;
    let main_visible: boolean = false;
    let gen_visible: boolean = false;
    let operations_visible: boolean = false;
    let settings_visible: boolean = false;

    let useColorsfor2D = false;

    function Export() {
        dispatcher('export_map', {
            genOpt: {
                seed: seed,
                width: width,
                height: height,
                maxAltitude: maxAltitude,
                minAltitude: minAltitude,
                levelOfDetail: levelOfDetail,
                roughnessCoefficient: roughnessCoefficient,
            }
        });
    }

    function Import() {
        dispatcher('import_map');
    }

    function Add() {
        dispatcher('add_map');
    }

    function Substr() {
        dispatcher('substr_map');
    }

    function ExcelExport() {
        dispatcher('excel_export_map');
    }
    function ImageExport() {
        dispatcher('image_export_map');
    }
    function ImageImport(){
        dispatcher('image_import_map');
    }

    function dimSwitch() {
        is2D = !is2D;
        is2D = is2D;
    }

    function settingsSave() {
        if (settings_visible === false) {
            const renderSettings: RenderSettings = {
                wireframe: mode.includes("2"),
                gradient: mode.includes("3"),
                lighting: mode.includes("1") && mode.includes("3"),
                wireframeOpacity: wireframeOpacity,
                wireframeLineWidth: wireframeLineWidth
            }
            dispatcher('settings_save', { render: renderSettings});
        }
    }
    
    function menuSwitch() {
        visible = !visible;
        visible = visible;
        main_visible = visible;
        main_visible = main_visible;
        gen_visible = false;
        gen_visible = gen_visible;
        operations_visible = false;
        operations_visible = operations_visible;
        if (settings_visible) {
            settings_visible = false;
            settings_visible = settings_visible;
            settingsSave();
        }
    }

    function d2SettingsSwitch() {
        useColorsfor2D = !useColorsfor2D;
        dispatcher('settings_save_2d', { useColors: useColorsfor2D });
    }
</script>

<div class="main_panel" class:opened_panel={visible}>
    <button class="closeup" class:burger_or={!visible} on:click={menuSwitch}>
        <div class="burger"></div>
    </button>
    <div class="content">
        <div class:hidden={!main_visible}>
            <button class="menu-but"
                    on:click={
                    () => {
                        main_visible = false;
                        main_visible = main_visible;
                        gen_visible = true;
                        gen_visible = gen_visible;
                    }
                }>
                <span>Generate...</span>
            </button>

            <button class="menu-but"
                    on:click={Import}>
                <span>Open...</span>
            </button>

            <button class="menu-but"
                    on:click={Export}>
                <span>Save</span>
            </button>

            <button class="menu-but"
                    on:click={
                    () => {
                        main_visible = false;
                        main_visible = main_visible;
                        operations_visible = true;
                        operations_visible = operations_visible;
                    }
                }>
                <span>Operations</span>
            </button>

            <button class="menu-but"
                    on:click={
                    () => {
                        main_visible = false;
                        main_visible = main_visible;
                        settings_visible = true;
                        settings_visible = settings_visible;
                    }
                }>
                <span>Settings</span>
            </button>
        </div>

        <div class:hidden={!gen_visible}>
            <Param>
                <label for="width">width: {width}</label>
                <input id="width"
                       class="basic-range"
                       type="range"
                       bind:value={width}
                       max="1000"
                       min="10"
                />
            </Param>

            <Param>
                <label for="height">height: {height}</label>
                <input id="height"
                       class="basic-range"
                       type="range"
                       bind:value={height}
                       max="1000"
                       min="10"
                />
            </Param>

            <Param>
                <label for="maxAltitude">max altitude: {maxAltitude}</label>
                <input id="maxAltitude"
                       class="basic-range"
                       type="range"
                       bind:value={maxAltitude}
                       max="50"
                       min="-50"
                />
            </Param>

            <Param>
                <label for="minAltitude">min altitude: {minAltitude}</label>
                <input id="minAltitude"
                       class="basic-range"
                       type="range"
                       bind:value={minAltitude}
                       max="50"
                       min="-50"
                />
            </Param>

            <Param>
                <label for="roughnessCoefficient">roughness: {roughnessCoefficient}</label>
                <input id="roughnessCoefficient"
                       class="basic-range"
                       type="range"
                       bind:value={roughnessCoefficient}
                       max="100"
                       min="1"
                />
            </Param>

            <Param>
                <label for="levelOfDetail">level of detail: {levelOfDetail}</label>
                <input id="levelOfDetail"
                       class="basic-range"
                       type="range"
                       bind:value={levelOfDetail}
                       max="50"
                       min="1"
                />
            </Param>

            <Param>
                <label for="seed">seed: {(seed === null || seed === 0) ? "random" : seed.toString()}</label>
                <input id="seed"
                       class="basic-text"
                       type="number"
                       min="0"
                       bind:value={seed}
                />
            </Param>

            <button class="menu-but"
                    on:click={
                    () => {
                        generate(
                            {
                                width: width,
                                height: height,
                                maxAltitude: maxAltitude,
                                minAltitude: minAltitude,
                                roughnessCoefficient: roughnessCoefficient / 100,
                                levelOfDetail: levelOfDetail,
                                seed: ((seed === null) ? 0 : seed)
                            }
                        )
                    }
                }>
                <span>Generate</span>
            </button>
        </div>

        <div class:hidden={!operations_visible}>
            <button class="menu-but"
                    on:click={Add}>
                <span>Add...</span>
            </button>

            <button class="menu-but"
                    on:click={Substr}>
                <span>Subtract...</span>
            </button>

            <button class="menu-but"
                    on:click={ExcelExport}>
                <span>Export as Table</span>
            </button>

            <button class="menu-but"
                    on:click={ImageExport}
                    class:hidden={!is2D}>
                <span>Export as Image</span>
            </button>

            <button class="menu-but"
                    on:click={ImageImport}>
                <span>Import from Image...</span>
            </button>
        </div>

        <div class:hidden={!settings_visible}>
            <button class="menu-but" on:click={dimSwitch}>
                <span>2D ⟷ 3D</span>
            </button>

            <div class:hidden={!is2D}>
                <button class="menu-but"
                        on:click={d2SettingsSwitch}>
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
                    <label for="modeLightning">Lighting:</label>
                    <input id="modeLightning"
                           type=checkbox
                           value={"1"}
                           bind:group={mode}
                    />

                    <label for="modeWireframe">Wireframe:</label>
                    <input id="modeWireframe"
                           type=checkbox
                           value={"2"}
                           bind:group={mode}
                    />

                    <label for="modeGradient">Gradient:</label>
                    <input id="modeGradient"
                           type=checkbox
                           value={"3"}
                           bind:group={mode}
                    />
                </Param>
            </div>

            <button class="menu-but" on:click={menuSwitch}>
                <span>Save</span>
            </button>
        </div>
    </div>
</div>
