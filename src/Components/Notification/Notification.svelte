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

<div class="notify-wind" class:visible_notify={visible} class:err={err}>
    {#if err}
        <img alt="notOk"
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Deletion_icon.svg/1024px-Deletion_icon.svg.png"/>
    {:else }
        <img alt="ok" src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Symbol_OK.svg/1024px-Symbol_OK.svg.png"/>
    {/if}
    <span>{spanText}</span>
</div>