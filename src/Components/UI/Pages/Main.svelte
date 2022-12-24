<script lang="ts">
    import {UIEventsHandler} from "../UIEventsHandler";
    import {Panels} from "../Pages";


    export let getGenData: Function;
    export let currPanel: Panels = Panels.MAIN;
    export let eventHandler: UIEventsHandler;
    let toGen = () => {currPanel = Panels.GENERATE;currPanel = currPanel;};
    let toOp = () => {currPanel = Panels.OPERATIONS;currPanel = currPanel;};
    let toSet = () => {currPanel = Panels.SETTINGS;currPanel = currPanel;};
    let exp = () => {eventHandler.Export(...getGenData)};
    let imp = () => {eventHandler.Import();};
</script>

<div>
    <button class="menu-but"
            on:click={toGen}>
        <span>Generate...</span>
    </button>

    <button class="menu-but"
            on:click={imp}>
        <span>Open...</span>
    </button>

    <button class="menu-but"
            on:click={exp}>
        <span>Save</span>
    </button>

    <button class="menu-but"
            on:click={toOp}>
        <span>Operations</span>
    </button>

    <button class="menu-but"
            on:click={toSet}>
        <span>Settings</span>
    </button>
</div>
