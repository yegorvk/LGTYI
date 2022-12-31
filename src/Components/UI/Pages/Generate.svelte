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
        <label for="generateWidth">Width: {width}</label>
        <input id="generateWidth"
               class="basic-range"
               type="range"
               bind:value={width}
               max="1000"
               min="10"
        />
    </Param>

    <Param>
        <label for="generateHeight">Height: {height}</label>
        <input id="generateHeight"
               class="basic-range"
               type="range"
               bind:value={height}
               max="1000"
               min="10"
        />
    </Param>

    <Param>
        <label for="generateMaxAltitude">Max altitude: {maxAltitude}</label>
        <input id="generateMaxAltitude"
               class="basic-range"
               type="range"
               bind:value={maxAltitude}
               max="120"
               min="-120"
        />
    </Param>

    <Param>
        <label for="generateMinAltitude">Min altitude: {minAltitude}</label>
        <input id="generateMinAltitude"
               class="basic-range"
               type="range"
               bind:value={minAltitude}
               max="120"
               min="-120"
        />
    </Param>

    <Param>
        <label for="generateRoughness">Roughness: {roughness}</label>
        <input id="generateRoughness"
               class="basic-range"
               type="range"
               bind:value={roughness}
               max="100"
               min="1"
        />
    </Param>

    <Param>
        <label for="generateLevelOfDetail">Level of detail: {levelOfDetail}</label>
        <input id="generateLevelOfDetail"
               class="basic-range"
               type="range"
               bind:value={levelOfDetail}
               max="20"
               min="1"
        />
    </Param>

    <Param>
        <label for="generateWaterLevel">Water level: {waterLevel}</label>
        <input id="generateWaterLevel"
               class="basic-range"
               type="range"
               bind:value={waterLevel}
               max="120"
               min="-120"
        />
    </Param>

    <Param>
        <label for="generateSeed">Seed: {(seed === null || seed === 0) ? "random" : seed.toString()}</label>
        <input id="generateSeed"
               class="basic-text"
               type="number"
               min="0"
               bind:value={seed}
        />
    </Param>

    <button class="menu-but center-text"
            on:click={Generate}>
        <span>Generate</span>
    </button>
</div>