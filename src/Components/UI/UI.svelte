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
    import {type GeneratorOptions} from "../../Terrain/GeneratorOptions";
    import {createEventDispatcher} from "svelte";
    import {Panels} from "./Pages";
    import {UIEventsHandler} from "./UIEventsHandler";
    import ImageImport from "./Pages/ImageImport.svelte";

    export let is2D: boolean = false;
    export let generate: (options: GeneratorOptions) => void = null;
    let visible: boolean = false;
    let currPanel: Panels = Panels.GENERATE;

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
        currPanel = Panels.MAIN;
    }

</script>

<div class="main_panel" class:opened_panel={visible}>
    <button class="closeup" class:burger_or={!visible} on:click={menuSwitch}>
        <div class="burger"></div>
    </button>
    <button class="back-but" hidden={currPanel === Panels.MAIN} disabled={currPanel === Panels.MAIN}
            on:click={backButton}>
        <img src="https://cdn.pixabay.com/photo/2012/04/11/10/22/arrow-27315_960_720.png" alt="back"/>
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
            <ImageImport></ImageImport>
        {/if}
    </div>
</div>
