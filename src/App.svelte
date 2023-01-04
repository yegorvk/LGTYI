<script lang="ts">
    import LandScapeViewer3d from './Components/LandscapeViewer3d.svelte'
    import UI from "./Components/UI/UI.svelte";
    import type {GeneratorOptions} from './Generator/GeneratorOptions';
    import Renderer2D from "./Components/Renderer2D.svelte";
    import {Heightmap} from "./Terrain/Heightmap";
    import {exportMap} from "./Files/Exporter";
    import {importMap} from "./Files/Importer";
    import Notification from "./Components/Notification/Notification.svelte";
    import AddMap from "./Files/Adder";
    import SubtructMap from "./Files/Subtracter";
    import ExcelExport from "./Files/ExcelExporter";
    import {DefaultRenderSettings} from "./Renderer/RenderSettings";
    import type {RenderSettings} from "./Renderer/RenderSettings"
    import {ImageExport} from "./Files/ImageExporter";
    import {ImageImport} from "./Files/ImageImporter";
    import type {UIEventsHandler} from "./Components/UI/UIEventsHandler";
    import "./LoadScreen.css";
    import { tick } from 'svelte';


    let trigger: boolean;
    let is2DView: boolean = false;
    let heightmap: Heightmap = Heightmap.flat(100, 100, 0, -1);
    let renderSettings: RenderSettings = DefaultRenderSettings;

    let useColors2d: boolean = false;
    let eventHandler: UIEventsHandler;
    let notify: (text: string, err: boolean) => {};
    let pixels: Uint8ClampedArray;

    const generate = (options: GeneratorOptions) => {
        if (options.seed === 0)
            options.seed = Math.round(Math.random() * 65536);

        isLoadingView = true;

        setTimeout(() => {
            heightmap = Heightmap.generate(options);
            isLoadingView = false;
            trigger = !trigger;
        }, 500);
    }

    let invisible = false;
    let isLoadingView = true;

    async function ImportMap() {
        invisible = true;
        try {
            let data = await importMap();
            is2DView = data.viewMode;
            is2DView = is2DView;
            eventHandler.generatorOptions = data.genOptions;
            eventHandler.renderTrueSettings = data.renderSettings;
            heightmap = data.heightMap as Heightmap;
            notify("Successfully opened!", false);
            heightmap = heightmap;
            invisible = false;
        } catch (err) {
            invisible = false;
            notify(err, true);
        }
    }

    async function addMap() {
        invisible = true;
        try {
            heightmap = await AddMap(heightmap);
            notify("Successfully added!", false);
            heightmap = heightmap;
            invisible = false;
        } catch (err) {
            invisible = false;
            notify(err, true);
        }

    }

    async function substrMap() {
        invisible = true;
        try {
            heightmap = await SubtructMap(heightmap);
            notify("Successfully subtracted!", false);
            heightmap = heightmap;
            invisible = false;
        } catch (err) {
            invisible = false;
            notify(err, true);
        }
    }

    function SettingsChange(e) {
        renderSettings = e.detail.render;
        invisible = true;
        setTimeout(() => {
            invisible = false;
            notify("Successfully", false);
        }, 50);
    }

    function ExportMap(e) {
        exportMap(heightmap, eventHandler, is2DView).then(() => {
            notify("Successfully saved!", false);
        }).catch(err => {
            notify(err, true)
        });
    }

    function ExcelExportMap() {
        ExcelExport(heightmap).then(() => {
            notify("Successfully exported!", false);
        }).catch(err => {
            notify(err, true)
        });
    }

    function ImageExportMap() {
        ImageExport(pixels, heightmap).then(() => {
            notify("Successfully exported to image!", false);
        }).catch(err => {
            notify(err, true)
        });
    }

    async function ImportImageMap(e) {
        invisible = true;
        try {
            let newMap = await ImageImport(e.detail.isAlphaMode, e.detail.isColorMode, e.detail.color, e.detail.grayscale, e.detail.waterLevel, e.detail.isInverted);
            notify("Successfully Imported", false);
            heightmap = newMap;
            heightmap = heightmap;
            invisible = false;
        } catch (e) {
            invisible = false;
            notify(e, true);
        }
    }
    let font = true;
    function FontSwitch(){
        font = !font;
    }
</script>

<main id="app_content" class:font-comfortaa={!font} class:font-ubuntu={font}>
    <Notification bind:notify={notify}></Notification>

    {#if !isLoadingView && !invisible}

    <UI {generate}
        bind:eventHandler
        bind:is2D={is2DView}
        on:settings_save_2d={(e) => {
            useColors2d = e.detail.useColors;

            if (is2DView)
                trigger = !trigger;
        }}
        on:export_map={ExportMap}
        on:import_map={ImportMap}
        on:add_map={addMap}
        on:substr_map={substrMap}
        on:excel_export_map={ExcelExportMap}
        on:settings_save={SettingsChange}
        on:image_export_map={ImageExportMap}
        on:image_import_map={ImportImageMap}
        on:font_switch={FontSwitch}/>

    
    {/if}

    {#if isLoadingView || invisible}

        <div class="load_screen">
            <div class="loadingio-spinner-spinner-r8uofwx50c"><div class="ldio-81av1u323tf">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div></div>
        </div>

    {/if}

    {#key trigger}

    {#if !invisible && heightmap !== null}
        {#if !is2DView}
            <LandScapeViewer3d 
                onPrepare={async () => {
                    isLoadingView = true;

                    await tick();

                    await new Promise((resolve) => {
                        setTimeout(resolve, 300)
                    });
                }}
                onReady={async () => { 
                    isLoadingView = false;
                }}
                {renderSettings} 
                {heightmap}/>
        {:else}
            <div class="d2-cont">
                <Renderer2D on:pixels={(e)=>{pixels = e.detail.pixels}} useColors={useColors2d}
                            data={heightmap}></Renderer2D>
            </div>
        {/if}
    {/if}

    {/key}
</main>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&family=Ubuntu:wght@500&display=swap');
    #app_content {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;

    }
    .font-comfortaa{
        font-family: 'Comfortaa', cursive;
    }
    .font-ubuntu{
        font-family: 'Ubuntu', sans-serif;
    }
    .load_screen{
        background: #010101;
        color: #ffffff;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 100;
    }
    .d2-cont {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
    }


    /*@font-face {*/
    /*    font-family: "Comfortaa";*/
    /*    font-style: normal;*/
    /*    src: url("./Fonts/Comfortaa-Bold.ttf") format("ttf");*/
    /*}*/
</style>



