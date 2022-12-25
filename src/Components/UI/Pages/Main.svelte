<script lang="ts">
    import {UIEventsHandler} from "../UIEventsHandler";
    import {Panels} from "../Pages";
    export let eventHandler: UIEventsHandler;
    let toGen = () => {eventHandler.setPanel(Panels.GENERATE)};
    let toOp = () => {eventHandler.setPanel(Panels.OPERATIONS)};
    let toSet = () => {eventHandler.setPanel(Panels.SETTINGS)};
    let exp = () => {eventHandler.Export(...Object.values(eventHandler.generatorOptions))};
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
