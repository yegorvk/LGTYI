<script lang="ts">
    import {UIEventsHandler} from "../UIEventsHandler";

    export let is2D: boolean;
    export let eventHandler: UIEventsHandler;
    let add = ()=>{eventHandler.Add()};
    let sub = ()=>{eventHandler.Substr()};
    let tableExp = ()=>{eventHandler.ExcelExport()};
    let imExp = ()=>{eventHandler.ImageExport()};
    let imImp = ()=>{eventHandler.ImageImport()};
</script>
<div>
    <button class="menu-but"
            on:click={add}>
        <span>Add...</span>
    </button>

    <button class="menu-but"
            on:click={sub}>
        <span>Subtract...</span>
    </button>

    <button class="menu-but"
            on:click={tableExp}>
        <span>Export as Table</span>
    </button>

    <button class="menu-but"
            on:click={imExp}
            class:hidden={!is2D}>
        <span>Export as Image</span>
    </button>

    <button class="menu-but"
            on:click={imImp}>
        <span>Import from Image...</span>
    </button>
</div>
