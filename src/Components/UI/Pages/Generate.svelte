<script lang="ts">
    import Param from "../Param/Param.svelte";
    import {DefaultGeneratorOptions, type GeneratorOptions} from "../../../Terrain/GeneratorOptions";
    import {UIEventsHandler} from "../UIEventsHandler";

    export let generate: (options: GeneratorOptions) => void = null;
    export let eventHandler: UIEventsHandler;

    let seed = eventHandler.generatorOptions.seed;
    let width = eventHandler.generatorOptions.width;
    let height = eventHandler.generatorOptions.height;
    let maxAltitude = eventHandler.generatorOptions.maxAltitude;
    let minAltitude = eventHandler.generatorOptions.minAltitude;
    let roughness = eventHandler.generatorOptions.roughness * 100;
    let levelOfDetail = eventHandler.generatorOptions.levelOfDetail;
    let waterLevel = eventHandler.generatorOptions.waterLevel;

    function Generate(){
        generate(
            {
                width: width,
                height: height,
                maxAltitude: maxAltitude,
                minAltitude: minAltitude,
                roughness: roughness / 100,
                levelOfDetail: levelOfDetail,
                seed: ((seed === null) ? 0 : seed),
                waterLevel: waterLevel
            }
        );
        eventHandler.generatorOptions = {
            width,
            height,
            maxAltitude,
            minAltitude,
            roughness: roughness,
            levelOfDetail,
            seed,
            waterLevel
        };
    }
</script>

<div>
    <Param>
        <span>Width: {width}</span>
        <input  class="basic-range"
                type="range"
                bind:value={width}
                max="1000"
                min="10"
        />
    </Param>

    <Param>
        <span>Height: {height}</span>
        <input  class="basic-range"
                type="range"
                bind:value={height}
                max="1000"
                min="10"
        />
    </Param>

    <Param>
        <span>Max altitude: {maxAltitude}</span>
        <input  class="basic-range"
                type="range"
                bind:value={maxAltitude}
                max="120"
                min="-120"
        />
    </Param>

    <Param>
        <span>Min altitude: {minAltitude}</span>
        <input  class="basic-range"
                type="range"
                bind:value={minAltitude}
                max="120"
                min="-120"
        />
    </Param>

    <Param>
        <span>Roughness: {roughness}</span>
        <input  class="basic-range"
                type="range"
                bind:value={roughness}
                max="100"
                min="1"
        />
    </Param>

    <Param>
        <span>Level of detail: {levelOfDetail}</span>
        <input  class="basic-range"
                type="range"
                bind:value={levelOfDetail}
                max="20"
                min="1"
        />
    </Param>

    <Param>
        <span>Water level: {waterLevel}</span>
        <input  class="basic-range"
                type="range"
                bind:value={waterLevel}
                max="120"
                min="-120"
        />
    </Param>

    <Param>
        <span>Seed: {(seed === null || seed === 0) ? "random" : seed.toString()}</span>
        <input  class="basic-text"
                type="number"
                min="0"
                bind:value={seed}
        />
    </Param>

    <button class="menu-but"
            on:click={Generate}>
        <span>Generate</span>
    </button>
</div>