<script lang="ts">
    import LandScapeViewer3d from './Components/LandscapeViewer3d.svelte'
    import UI from "./Components/UI/UI.svelte";
    import {DefaultGeneratorOptions, type GeneratorOptions} from './Terrain/GeneratorOptions';
    import Renderer2D from "./Components/Renderer2D.svelte";
    import {Heightmap} from "./Terrain/Heightmap";
    import {exportMap} from "./Files/Exporter";
    import {importMap} from "./Files/Importer";
    import Notification from "./Components/Notification/Notification.svelte";
    import AddMap from "./Files/Adder";
    import SubtructMap from "./Files/Subtructer";
    import ExcelExport from "./Files/ExcelExporter";
    import {DefaultRenderSettings} from "./Renderer/RenderSettings";
    import type {RenderSettings} from "./Renderer/RenderSettings"
    import {ImageExport} from "./Files/ImageExporter";
    import {ImageImport} from "./Files/ImageImporter";
    import {UIEventsHandler} from "./Components/UI/UIEventsHandler";
    import "./LoadScreen.css"

    let trigger: boolean;
    let is2DView: boolean = false;
    let heightmap: Heightmap = Heightmap.generate(DefaultGeneratorOptions);
    let renderSettings: RenderSettings = DefaultRenderSettings;

    let useColors2d: boolean = false;
    let eventHandler: UIEventsHandler;
    let notify: (text: string, err: boolean) => {};
    let pixels: Uint8ClampedArray;
    const generate = (options: GeneratorOptions) => {
        if (options.seed === 0)
            options.seed = Math.round(Math.random() * 65536)

        heightmap = Heightmap.generate(options)
        trigger = !trigger
    }

    let invisible = false;

    async function ImportMap() {
        invisible = true;
        try {
            let data = await importMap();
            is2DView = data.viewMode;
            is2DView = is2DView;
            eventHandler.generatorOptions = data.genOptions;
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
        exportMap(heightmap, e.detail.genOpt, is2DView).then(() => {
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
            let newMap = await ImageImport(e.detail.isAlphaMod, e.detail.isColorMod, e.detail.color, e.detail.grayscale, e.detail.waterLevel);
            notify("Successfully Imported", false);
            heightmap = newMap;
            heightmap = heightmap;
            invisible = false;
        } catch (e) {
            invisible = false;
            notify(e, true);
        }
    }

</script>

<main id="app_content">
    <Notification bind:notify={notify}></Notification>
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
        on:image_import_map={ImportImageMap}/>
    {#if !invisible}
        {#if !is2DView}
            {#key trigger}
                <LandScapeViewer3d {renderSettings} {heightmap}/>
            {/key}
        {:else}
            <div class="d2-cont">
                {#key trigger}
                    <Renderer2D on:pixels={(e)=>{pixels = e.detail.pixels}} useColors={useColors2d}
                                data={heightmap}></Renderer2D>
                {/key}
            </div>
        {/if}
    {:else}
        <div class="load_screen">
            <div class="loadingio-spinner-spinner-r8uofwx50c"><div class="ldio-81av1u323tf">
                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div></div>
        </div>
    {/if}
</main>

<style>
    #app_content {
        width: 100%;
        height: 100%;
        overflow: hidden;

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
    }
    .d2-cont {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: auto;
    }
</style>



