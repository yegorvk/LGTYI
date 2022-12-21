<script lang="ts" xmlns="http://www.w3.org/1999/html">
 import "./UI.css";
 import "./Range.css";
 import Param from "./Param/Param.svelte";
 import { DefaultGeneratorOptions, type GeneratorOptions } from "../../Terrain/GeneratorOptions";
 import {createEventDispatcher} from "svelte";

 export let is2D: boolean = false;
 export let generate: (options: GeneratorOptions) => void = null;

 let dispatcher = createEventDispatcher();

 let size: number = DefaultGeneratorOptions.size;
 let maxAltitude: number = DefaultGeneratorOptions.maxAltitude;
 let minAltitude: number = DefaultGeneratorOptions.minAltitude;
 let roughnessCoefficient: number = DefaultGeneratorOptions.roughnessCoefficient * 100;
 let levelOfDetail: number = DefaultGeneratorOptions.levelOfDetail;

 let visible: boolean = false;
 let main_visible: boolean = false;
 let gen_visible: boolean = false;
 let imp_visible: boolean = false;

 function Export(){
     dispatcher('export_map');
 }
 function Import(){
     dispatcher('import_map');
 }
 function Add(){
     dispatcher('add_map');
 }
 function Substr(){
     dispatcher('substr_map');
 }

 function dimSwitch(){
     is2D = !is2D;
     is2D = is2D;
 }

 function menuSwitch(){
     visible = !visible;
     visible = visible;
     main_visible = visible;
     main_visible = main_visible;
     gen_visible = false;
     gen_visible = gen_visible;
     imp_visible = false;
     imp_visible = imp_visible;
 }
</script>

<div class="main_panel" class:opened_panel={visible}>
    <button class="closeup" class:burger_or={!visible} on:click={menuSwitch}>
        <div class="burger"></div>
    </button>
    <div class="content">
        <div class:hidden={!main_visible}>
            <button class="menu-but" on:click={dimSwitch}>
                <span>2D ⟷ 3D</span>
            </button>

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
                <span>Import...</span>
            </button>

            <button class="menu-but"
                    on:click={Export}>
                <span>Export</span>
            </button>
            <button class="menu-but"
                    on:click={Add}>
                <span>Add</span>
            </button>
            <button class="menu-but"
                    on:click={Substr}>
                <span>Subtract</span>
            </button>
        </div>
        <div class:hidden={!gen_visible}>
            <Param>
                <span>size: {size}</span>
                <input class="basic-range"
                       type="range"
                       bind:value={size}
                       max="1000"
                       min="10">
            </Param>

            <Param>
                <span>max altitude: {maxAltitude}</span>
                <input class="basic-range"
                       type="range"
                       bind:value={maxAltitude}
                       max="50"
                       min="-50">
            </Param>

            <Param>
                <span>min altitude: {minAltitude}</span>
                <input class="basic-range"
                       type="range"
                       bind:value={minAltitude}
                       max="50"
                       min="-50">
            </Param>

            <Param>
                <span>roughness: {roughnessCoefficient}</span>
                <input class="basic-range"
                       type="range"
                       bind:value={roughnessCoefficient}
                       max="100"
                       min="1">
            </Param>

            <Param>
                <span>level of detail: {levelOfDetail}</span>
                <input class="basic-range"
                       type="range"
                       bind:value={levelOfDetail}
                       max="50"
                       min="1">
            </Param>

            <button class="menu-but"
                on:click={
                    () => {
                        generate(
                            {
                                size: size,
                                maxAltitude: maxAltitude,
                                minAltitude: minAltitude,
                                roughnessCoefficient: roughnessCoefficient / 100,
                                levelOfDetail: levelOfDetail
                            }
                        )
                    }
                }>
                <span>Generate</span>
            </button>
        </div>
    </div>
</div>
