<script lang="ts" xmlns="http://www.w3.org/1999/html">
    //styles
    import "./styles/UI.css";
    import "./styles/Range.css";
    import "./styles/Buttons.css";
    import "./styles/Burger.css";
    import './InfoPages/Panel.css';
    //components
    import Generate from "./Pages/Generate.svelte";
    import Operations from "./Pages/Operations.svelte";
    import Settings from "./Pages/Settings.svelte";
    import Main from "./Pages/Main.svelte";
    import ImageImport from "./Pages/ImageImport.svelte";
    import HelpUIButtons from "./InfoPages/HelpUIButtons.svelte";
    import Help from "./InfoPages/Pages/Help.svelte";
    import Info from "./InfoPages/Pages/Info.svelte";
    import Tips from "./InfoPages/Pages/Tips.svelte";
    import Panel from "./InfoPages/Panel.svelte";
    //classes
    import type {GeneratorOptions} from "../../Generator/GeneratorOptions";
    import {createEventDispatcher} from "svelte";
    import {Panels} from "./Pages";
    import {UIEventsHandler} from "./UIEventsHandler";
    import {InfoPanels} from "./InfoPages/InfoPanels";


    export let is2D: boolean = false;
    export let generate: (options: GeneratorOptions) => void = null;
    let main_visible: boolean = false;
    let currPanel: Panels = Panels.MAIN;
    let currInfoPanel: InfoPanels = InfoPanels.NONE;

    let dispatcher = createEventDispatcher();
    export let eventHandler: UIEventsHandler = new UIEventsHandler(dispatcher);
    eventHandler.setPanel = (panel: Panels) => {
        currPanel = panel;
    }

    function main_switch() {
        main_visible = !main_visible;
        currPanel = Panels.MAIN;
    }

    function back() {
        if (currPanel == Panels.IMAGE_IMPORT) currPanel = Panels.OPERATIONS;
        else currPanel = Panels.MAIN;
    }

</script>

<button id="menu-main"
        class="func-but"
        class:burger_or={!main_visible}
        on:click={main_switch}>
    <div class="burger"></div>
</button>

<div class="main_panel" class:opened_main_panel={main_visible}>
    <button id="back-menu-main"
            class="func-but"
            class:hidden={!main_visible || currPanel === Panels.MAIN}
            on:click={back}>
        <img src="./assets/back.png" alt="back"/>
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

<HelpUIButtons bind:currInfoPanel></HelpUIButtons>
<Panel {currInfoPanel}>
    {#if currInfoPanel === InfoPanels.HELP}
        <Help></Help>
    {:else if currInfoPanel === InfoPanels.INFO}
        <Info></Info>
    {:else if currInfoPanel === InfoPanels.TIPS}
        <Tips></Tips>
    {/if}
</Panel>
