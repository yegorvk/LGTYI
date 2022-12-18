<script lang="ts">
 import "./UI.css";
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
            <h3>placeholder: {value}</h3>
            <input type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <h3>placeholder: {value}</h3>
            <input type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <h3>placeholder: {value}</h3>
            <input type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <h3>placeholder: {value}</h3>
            <input type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <h3>placeholder: {value}</h3>
            <input type="range" bind:value={value} max="10" min="0">
        </Param>
        <Param>
            <h3>placeholder: {value}</h3>
            <input type="range" bind:value={value} max="10" min="0">
        </Param>
        <button class="menu-but">
            Generate
        </button>
        <button class="menu-but">
            Import
        </button>
        <button class="menu-but">
            Export
        </button>
    </div>
</div>
