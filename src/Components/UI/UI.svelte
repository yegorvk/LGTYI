<script lang="ts" xmlns="http://www.w3.org/1999/html">
    import "./UI.css";
    import "./Range.css";
    import Generate from "./Pages/Generate.svelte";
    import Operations from "./Pages/Operations.svelte";
    import Settings from "./Pages/Settings.svelte";
    import {type GeneratorOptions} from "../../Terrain/GeneratorOptions";
    import {createEventDispatcher, onMount} from "svelte";
    import {Panels} from "./Pages";
    import Main from "./Pages/Main.svelte";
    import {UIEventsHandler} from "./UIEventsHandler";

    export let is2D: boolean = false;
    export let generate: (options: GeneratorOptions) => void = null;
    export let setGeneratorData;
    let getGenData;
    let eventHandler: UIEventsHandler;
    let visible: boolean = false;
    let currPanel: Panels = Panels.GENERATE;

    let dispatcher = createEventDispatcher();
    eventHandler = new UIEventsHandler(dispatcher);
    eventHandler.setPanel = (panel: Panels)=>{
        currPanel = panel;
    }

    function menuSwitch() {
        visible = !visible;
        currPanel = Panels.MAIN;
    }

</script>

<div class="main_panel" class:opened_panel={visible}>
    <button class="closeup" class:burger_or={!visible} on:click={menuSwitch}>
        <div class="burger"></div>
    </button>
    <div class="content">
        {#if currPanel === Panels.MAIN}
            <Main {getGenData} {eventHandler}></Main>
        {:else if currPanel === Panels.GENERATE}
            <Generate bind:setGeneratorData {generate} {eventHandler}></Generate>
        {:else if currPanel === Panels.OPERATIONS}
            <Operations {is2D} {eventHandler}></Operations>
        {:else if currPanel === Panels.SETTINGS}
            <Settings bind:is2D={is2D} {eventHandler}></Settings>
        {/if}
    </div>
</div>
