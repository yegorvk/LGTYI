<script lang="ts">
 import "./UI.css";
 import "./Range.css";
 import Param from "./Param.svelte";
 import { DefaultGeneratorOptions, type GeneratorOptions } from "../Terrain/GeneratorOptions";



 //let options = DefaultGeneratorOptions
 export let is2D: boolean = false;
 export let generate: (options: GeneratorOptions) => void = undefined;
 export let d2VScale: number = 5;

 let size: number = DefaultGeneratorOptions.size;
 let maxAltitude: number = DefaultGeneratorOptions.maxAltitude;
 let roughnessCoefficient: number = DefaultGeneratorOptions.roughnessCoefficient * 100;
 let levelOfDetail: number = DefaultGeneratorOptions.levelOfDetail;

 let visible: boolean = false;
 function dimSwitch(){
     is2D = !is2D;
     is2D = is2D;
 }
 function menuSwitch(){
     visible = !visible;
     visible = visible;
 }
</script>

<div class="main_panel" class:opened_panel={visible}>
    <button class="closeup" class:burger_or={!visible} on:click={menuSwitch}>
        <div class="burger"></div>
    </button>
    <div class="content">
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
                   min="10">
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

        <Param>
            <span>2D</span>
            <input class="basic-check"
                   type="checkbox"
                   on:change = {dimSwitch}>
            <span>2D View Scale: {d2VScale}</span>
            <input class="basic-range"
                   type="range"
                   bind:value={d2VScale}
                   max="20"
                   min="1"
                   disabled={is2D}>
        </Param>

        <button class="menu-but" disabled={is2D}
                on:click={
                    () => {
                        generate(
                            {
                                size: size,
                                maxAltitude: maxAltitude,
                                roughnessCoefficient: roughnessCoefficient / 100,
                                levelOfDetail: levelOfDetail
                            }
                        )
                    }
                }>
            <span>Generate</span>
        </button>

        <button class="menu-but">
            <span>Import</span>
        </button>

        <button class="menu-but">
            <span>Export</span>
        </button>
    </div>
</div>
