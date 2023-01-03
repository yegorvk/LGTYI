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
    let main_visible: boolean = false;
    let help_visible: boolean = false;
    let help_win_visible: boolean = false;
    let info_win_visible: boolean = false;
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

    function back() {
        if (currPanel == Panels.IMAGE_IMPORT) currPanel = Panels.OPERATIONS;
        else currPanel = Panels.MAIN;
    }

    function help_switch() {
        help_visible = !help_visible;
    }

    function help_win_switch() {
        help_win_visible = !help_win_visible;
    }

    function info_win_switch() {
        info_win_visible = !info_win_visible;
    }
</script>

<button title="Menu"
        id="menu-main"
        class="func-but"
        class:burger_or={!main_visible}
        on:click={main_switch}>
    <div class="burger"></div>
</button>

<div class="main_panel" class:opened_main_panel={main_visible}>
    <button title="Back"
            id="back-menu-main"
            class="func-but"
            class:hidden={!main_visible || currPanel === Panels.MAIN}
            on:click={back}>
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
        class="func-but"
        on:click={help_switch}>
    {#if !help_visible}
        <img src="help.png" alt="help"/>
    {:else}
        <img src="close.png" alt="close"/>
    {/if}
</button>

<div class:opened_help_panel={help_visible}>
    <button title="Tips"
            id="tips"
            class="func-but"
            disabled={!help_visible}>
        <img src="tips.png" alt="tips"/>
    </button>

    <button title="Help"
            id="help"
            class="func-but"
            disabled={!help_visible}
            on:click={help_win_switch}>
        <img src="help.png" alt="help"/>
    </button>

    <button title="Info"
            id="info"
            class="func-but"
            disabled={!help_visible}
            on:click={info_win_switch}>
        <img src="info.png" alt="info"/>
    </button>
</div>

<div class="win"
     class:hidden={!help_win_visible}>
     <button title="Close"
             class="func-but close-win-but"
             class:hidden={!help_win_visible}
             on:click={help_win_switch}>
         <img src="close.png" alt="close"/>
     </button>
    <p class="win-title">Landscape Generator for TYI</p>
</div>

<div class="win"
     class:hidden={!info_win_visible}>
    <button title="Close"
            class="func-but close-win-but"
            class:hidden={!info_win_visible}
            on:click={info_win_switch}>
        <img src="close.png" alt="close"/>
    </button>
    <p class="win-title">Landscape Generator for TYI</p>

    <p>
        A landscape generator made for TYI-2023. Authors:
    </p>
    <ul>
        <li>Yehor Vaskonian</li>
        <li>Anton Matiash</li>
        <li>Denys Honcharov</li>
        <li>Oleksandr Belinskyi</li>
        <li>Yurii Chernenko</li>
    </ul>

    <p>
        The source code and the license are available on <a target="_blank" href="https://github.com/egor-vaskon/LGTYI">GitHub</a>.
    </p>

    <p class="win-title">Copyright</p>
    <p>
        <a target="_blank" href="https://icons8.com/icon/77/info">Info</a>, <a target="_blank" href="https://icons8.com/icon/646/help">Help</a>, <a target="_blank" href="https://icons8.com/icon/75/idea">Tips</a>, <a target="_blank" href="https://icons8.com/icon/3062/cancel">Close</a> icons by <a target="_blank" href="https://icons8.com">Icons8</a>.
    </p>
</div>