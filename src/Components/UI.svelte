<script lang="ts">
 import "./UI.css";



 let visible: boolean = true;

</script>

<div class="main_panel">
    {#if visible===true}
        <div class="opened_panel">

        </div>
    {:else }
        <div class="closed_panel">

        </div>
    {/if}
</div>
