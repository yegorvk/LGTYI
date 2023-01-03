<script lang="ts">
    import "./Notification.css";

    let visible = false;
    let err = false;
    let spanText = "nothing bad here";

    export let notify = (text: string, isErr: boolean): void => {
        visible = true;
        err = isErr;
        spanText = text;
        setTimeout(() => {
            visible = false;
            visible = visible
        }, 5000);
    }
</script>

<div class="notify-wind" class:visible={visible}>
    {#if err}
        <img src="./assets/cross.png" alt="not ok"/>
    {:else}
        <img src="./assets/checkmark.png" alt="ok"/>
    {/if}
    <span class:red={err}>{spanText}</span>
</div>