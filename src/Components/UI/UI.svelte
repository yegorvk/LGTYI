<script lang="ts" xmlns="http://www.w3.org/1999/html">
    //styles
    import "./styles/UI.css";
    import "./styles/Range.css";
    import "./styles/Buttons.css";
    import "./styles/Burger.css";
    //components
    import Generate from "./Pages/Generate.svelte";
    import Operations from "./Pages/Operations.svelte";
    import Settings from "./Pages/Settings.svelte";
    import Main from "./Pages/Main.svelte";
    //classes
    import type {GeneratorOptions} from "../../Generator/GeneratorOptions";
    import {createEventDispatcher} from "svelte";
    import {Panels} from "./Pages";
    import {UIEventsHandler} from "./UIEventsHandler";
    import ImageImport from "./Pages/ImageImport.svelte";

    export let is2D: boolean = false;
    export let generate: (options: GeneratorOptions) => void = null;
    let visible: boolean = false;
    let currPanel: Panels = Panels.MAIN;

    let dispatcher = createEventDispatcher();
    export let eventHandler: UIEventsHandler = new UIEventsHandler(dispatcher);
    eventHandler.setPanel = (panel: Panels) => {
        currPanel = panel;
    }

    function menuSwitch() {
        visible = !visible;
        currPanel = Panels.MAIN;
    }

    function backButton() {
        if (currPanel == Panels.IMAGE_IMPORT) currPanel = Panels.OPERATIONS;
        else currPanel = Panels.MAIN;
    }
</script>

<div class="main_panel" class:opened_panel={visible}>
    <button title="Menu"
            class="closeup"
            class:burger_or={!visible}
            on:click={menuSwitch}>
        <div class="burger"></div>
    </button>
    <button title="Back"
            class="back-but"
            class:hidden={currPanel === Panels.MAIN}
            disabled={currPanel === Panels.MAIN}
            on:click={backButton}>
        <img src="back_arrow.png" alt="back"/>
    </button>
    <div class="content">
        {#if currPanel === Panels.MAIN}
            <Main {eventHandler}></Main>
        {:else if currPanel === Panels.GENERATE}
            <Generate {generate} {eventHandler}></Generate>
        {:else if currPanel === Panels.OPERATIONS}
            <Operations {is2D} {eventHandler}></Operations>
        {:else if currPanel === Panels.SETTINGS}
            <Settings bind:is2D={is2D} {eventHandler}></Settings>
        {:else if currPanel === Panels.IMAGE_IMPORT}
            <ImageImport {eventHandler}></ImageImport>
        {/if}
    </div>
</div>
