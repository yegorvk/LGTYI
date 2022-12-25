<script lang="ts">
    import Param from "../Param/Param.svelte";
    import {DefaultGeneratorOptions, type GeneratorOptions} from "../../../Terrain/GeneratorOptions";
    import {UIEventsHandler} from "../UIEventsHandler";
    import {beforeUpdate, onMount} from "svelte";

    export let generate: (options: GeneratorOptions) => void = null;
    export let eventHandler: UIEventsHandler;

    let genOpt: GeneratorOptions = DefaultGeneratorOptions;
    $: seed = genOpt.seed;
    $: width = genOpt.width;
    $: height = genOpt.height;
    $: maxAltitude = genOpt.maxAltitude;
    $: minAltitude = genOpt.minAltitude;
    $: roughnessCoefficient = genOpt.roughnessCoefficient * 100;
    $: levelOfDetail = genOpt.levelOfDetail;
    $: waterLevel = genOpt.waterLevel;

    onMount(()=>{
        console.log(genOpt)
    });

    export let setGeneratorData = (genData: GeneratorOptions) => {
        genOpt = genData;
        genOpt = genOpt
    };
    eventHandler.getGenData = (): GeneratorOptions => {
        return genOpt;
    };


</script>
<div>
    <Param>
        <label for="width">width: {width}</label>
        <input
                id="width"
                class="basic-range"
                type="range"
                bind:value={width}
                max="1000"
                min="10"
        />
    </Param>

    <Param>
        <label for="height">height: {height}</label>
        <input
                id="height"
                class="basic-range"
                type="range"
                bind:value={height}
                max="1000"
                min="10"
        />
    </Param>

    <Param>
        <label for="maxAltitude">max altitude: {maxAltitude}</label>
        <input
                id="maxAltitude"
                class="basic-range"
                type="range"
                bind:value={maxAltitude}
                max="50"
                min="-50"
        />
    </Param>

    <Param>
        <label for="minAltitude">min altitude: {minAltitude}</label>
        <input
                id="minAltitude"
                class="basic-range"
                type="range"
                bind:value={minAltitude}
                max="50"
                min="-50"
        />
    </Param>

    <Param>
        <label for="roughnessCoefficient">roughness: {roughnessCoefficient}</label>
        <input
                id="roughnessCoefficient"
                class="basic-range"
                type="range"
                bind:value={roughnessCoefficient}
                max="100"
                min="1"
        />
    </Param>

    <Param>
        <label for="levelOfDetail">level of detail: {levelOfDetail}</label>
        <input
                id="levelOfDetail"
                class="basic-range"
                type="range"
                bind:value={levelOfDetail}
                max="50"
                min="1"
        />
    </Param>

    <Param>
        <label for="waterLevel">water level: {waterLevel}</label>
        <input
                id="waterLevel"
                class="basic-range"
                type="range"
                bind:value={waterLevel}
                max="51"
                min="-60"
        />
    </Param>

    <Param>
        <label for="seed">seed: {(seed === null || seed === 0) ? "random" : seed.toString()}</label>
        <input
                id="seed"
                class="basic-text"
                type="number"
                min="0"
                bind:value={seed}
        />
    </Param>

    <button class="menu-but"
            on:click={
                    () => {
                        generate(
                            {
                                width: width,
                                height: height,
                                maxAltitude: maxAltitude,
                                minAltitude: minAltitude,
                                roughnessCoefficient: roughnessCoefficient / 100,
                                levelOfDetail: levelOfDetail,
                                seed: ((seed === null) ? 0 : seed),
                                waterLevel: waterLevel
                            }
                        )
                    }
                }>
        <span>Generate</span>
    </button>
</div>