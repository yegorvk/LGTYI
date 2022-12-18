<script lang="ts">
 import "./UI.css";
 import "./Range.css";
 import Param from "./Param.svelte";
 export let value:number = 0;
 let visible: boolean = true;
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
            <span>placeholder: {value}</span>
            <input class="basic-range" type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <span>placeholder: {value}</span>
            <input class="basic-range" type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <span>placeholder: {value}</span>
            <input class="basic-range" type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <span>placeholder: {value}</span>
            <input class="basic-range" type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <span>placeholder: {value}</span>
            <input class="basic-range" type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <span>placeholder: {value}</span>
            <input class="basic-range" type="range" bind:value={value} max="10" min="0">
        </Param>
        <button class="menu-but">
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
