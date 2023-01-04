<script lang="ts">
    import {InfoPanels} from "./InfoPanels";

    let help_visible = false;
    export let currInfoPanel: InfoPanels = InfoPanels.NONE;

    let help = () => {
        if (currInfoPanel === InfoPanels.HELP)
            currInfoPanel = InfoPanels.NONE;
        else
            currInfoPanel = InfoPanels.HELP;
    };
    let info = () => {
        if (currInfoPanel === InfoPanels.INFO)
            currInfoPanel = InfoPanels.NONE;
        else
            currInfoPanel = InfoPanels.INFO;
    };
    let tips = () => {
        if (currInfoPanel === InfoPanels.TIPS)
            currInfoPanel = InfoPanels.NONE;
        else
            currInfoPanel = InfoPanels.TIPS;
    };
    let panel = () => {
        help_visible = !help_visible;
        if (!help_visible) {
            currInfoPanel = InfoPanels.NONE;
        }
    };
</script>

<button title="Help"
        id="help-main"
        class="func-but"
        on:click={panel}>
    {#if !help_visible}
        <img src="./assets/help.png" alt="help"/>
    {:else}
        <img src="./assets/close.png" alt="close"/>
    {/if}
</button>

<div class:opened_help_panel={help_visible}>
    <a title="Tips"
       id="tips"
       class="func-but"
       disabled={!help_visible}
       target="_blank"
       href="instruction/dovidka.html">
        <!--            on:click={tips}>-->
        <img src="./assets/tips.png" alt="tips"/>
    </a>

    <a title="Help"
       id="help"
       class="func-but"
       disabled={!help_visible}
       target="_blank"
       href="docs/index.html">
        <!--            on:click={help}>-->

        <img src="./assets/help.png" alt="help"/>
    </a>

    <button title="Info"
            id="info"
            class="func-but"
            disabled={!help_visible}
            on:click={info}>
        <img src="./assets/info.png" alt="info"/>
    </button>
</div>
