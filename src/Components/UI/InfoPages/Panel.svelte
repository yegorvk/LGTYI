<script lang="ts">
    import {InfoPanels} from "../InfoPanels";
    export let currInfoPanel: InfoPanels;
</script>

<div class="win"
     class:win-hidden={currInfoPanel === InfoPanels.NONE}
>
    <slot>
    </slot>
</div>