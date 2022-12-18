<script lang="ts">
    import LandScapeViewer3d from './Components/LandscapeViewer3d.svelte'
    import UI from "./Components/UI.svelte";
</script>

<main>
    <UI></UI>
    <LandScapeViewer3d/>
</main>

<style>
main {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>