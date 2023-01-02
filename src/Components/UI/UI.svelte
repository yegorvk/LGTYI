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
    import type {GeneratorOptions} from "../../Terrain/GeneratorOptions";
    import {createEventDispatcher} from "svelte";
    import {Panels} from "./Pages";
    import {UIEventsHandler} from "./UIEventsHandler";
    import ImageImport from "./Pages/ImageImport.svelte";

    export let is2D: boolean = false;
    export let generate: (options: GeneratorOptions) => void = null;
    let main_visible: boolean = false;
    let help_visible: boolean = false;
    let currPanel: Panels = Panels.MAIN;

    let dispatcher = createEventDispatcher();
    export let eventHandler: UIEventsHandler = new UIEventsHandler(dispatcher);
    eventHandler.setPanel = (panel: Panels) => {
        currPanel = panel;
    }

    function main_switch() {
        main_visible = !main_visible;
        currPanel = Panels.MAIN;
    }

    function help_switch() {
        help_visible = !help_visible;
    }

    function backButton() {
        if (currPanel == Panels.IMAGE_IMPORT) currPanel = Panels.OPERATIONS;
        else currPanel = Panels.MAIN;
    }
</script>

<button title="Menu"
        id="menu-main"
        class="main-but"
        class:burger_or={!main_visible}
        on:click={main_switch}>
    <div class="burger"></div>
</button>

<div class="main_panel" class:opened_main_panel={main_visible}>
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

<button title="Help"
        id="help-main"
        class="main-but"
        on:click={help_switch}>
    {#if !help_visible}
        <img src="help.png" alt="help"/>
    {:else}
        <img src="close.png" alt="help"/>
    {/if}
</button>

<div class:opened_help_panel={help_visible}>
    <button title="Tips"
            id="tips"
            class="main-but"
            disabled={!help_visible}>
        <img src="tips.png" alt="tips"/>
    </button>

    <button title="Help"
            id="help"
            class="main-but"
            disabled={!help_visible}>
        <img src="help.png" alt="help"/>
    </button>

    <button title="Info"
            id="info"
            class="main-but"
            disabled={!help_visible}>
        <img src="info.png" alt="info"/>
    </button>
</div>