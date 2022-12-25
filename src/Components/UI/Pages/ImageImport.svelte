<script lang="ts">
    import {UIEventsHandler} from "../UIEventsHandler";

    export let eventHandler: UIEventsHandler;
    let imp = () => {eventHandler.ImageImport();};
</script>


<div>


    <button class="menu-but"
            on:click={imp}>
        <span>Import</span>
    </button>
</div>