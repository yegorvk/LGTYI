<script lang="ts">
    import {InfoPanels} from "./InfoPanels";

    let help_visible = false;
    export let currInfoPanel: InfoPanels = InfoPanels.NONE;

    let helpSwitch = () => {
        help_visible = !help_visible;
        if (!help_visible) currInfoPanel = InfoPanels.NONE;
    };

    let infoPanelSwitch = () => {
        if (currInfoPanel === InfoPanels.INFO) currInfoPanel = InfoPanels.NONE;
        else currInfoPanel = InfoPanels.INFO;
    };
</script>

<button title="Help"
        id="help-main"
        class="func-but"
        on:click={helpSwitch}>
    {#if !help_visible}
        <img src="./assets/help.png" alt="help"/>
    {:else}
        <img src="./assets/close.png" alt="close"/>
    {/if}
</button>

<div class:opened_help_panel={help_visible}>
    <a id="docs"
       class="func-but"
       target="_blank"
       href="docs/index.html">
        <img src="./assets/tips.png" alt="tips"/>
    </a>

    <a id="help"
       class="func-but"
       target="_blank"
       href="instruction/index.htm">
        <img src="./assets/help.png" alt="help"/>
    </a>

    <button title="Info"
            id="info"
            class="func-but"
            on:click={infoPanelSwitch}>
        <img src="./assets/info.png" alt="info"/>
    </button>
</div>
