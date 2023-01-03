<script lang="ts">
    import Param from "../Param/Param.svelte";
    import {DefaultGeneratorOptions, type GeneratorOptions} from "../../../Generator/GeneratorOptions";
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

    let numberOfBiomes = eventHandler.generatorOptions.numberOfBiomes;
    let oceanChance = eventHandler.generatorOptions.biomes.oceanChance;
    let seaChance = eventHandler.generatorOptions.biomes.seaChance;
    let swampChance = eventHandler.generatorOptions.biomes.plateuChance;
    let plainsChance = eventHandler.generatorOptions.biomes.lakeChance;
    let hillsChance = eventHandler.generatorOptions.biomes.highPeaksChance;
    let plateuChance = eventHandler.generatorOptions.biomes.hillsChance;
    let lakeChance = eventHandler.generatorOptions.biomes.swampChance;
    let highPeaksChance = eventHandler.generatorOptions.biomes.plainsChance;

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
                waterLevel: waterLevel,
                biomes: {
                    oceanChance,
                    seaChance,
                    swampChance,
                    plainsChance,
                    hillsChance,
                    plateuChance,
                    lakeChance,
                    highPeaksChance
                },
                numberOfBiomes: numberOfBiomes
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
            waterLevel,
            biomes: {
                oceanChance,
                seaChance,
                swampChance,
                plainsChance,
                hillsChance,
                plateuChance,
                lakeChance,
                highPeaksChance
            },
            numberOfBiomes: numberOfBiomes
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
    <Param>
        <label >Number Of Biomes: {numberOfBiomes}</label>
        <input
               class="basic-range"
               type="range"
               bind:value={numberOfBiomes}
               max="30"
               min="1"
        />
    </Param>
    <Param>
        <h3>Biomes Distribution</h3>
        <hr/>
        <label>OceanChance: {oceanChance}</label>
        <input
               class="basic-range"
               type="range"
               bind:value={oceanChance}
               step="0.01"
               max="1"
               min="0"
        />
        <label>SeaChance: {seaChance}</label>
        <input
                class="basic-range"
                type="range"
                bind:value={seaChance}
                step="0.01"
                max="1"
                min="0"
        />
        <label>SwampChance: {swampChance}</label>
        <input
                class="basic-range"
                type="range"
                bind:value={swampChance}
                step="0.01"
                max="1"
                min="0"
        />
        <label>LakeChance: {lakeChance}</label>
        <input
                class="basic-range"
                type="range"
                bind:value={lakeChance}
                step="0.01"
                max="1"
                min="0"
        />
        <label>PlainsChance: {plainsChance}</label>
        <input
                class="basic-range"
                type="range"
                bind:value={plainsChance}
                step="0.01"
                max="1"
                min="0"
        />
        <label>HillsChance: {hillsChance}</label>
        <input
                class="basic-range"
                type="range"
                bind:value={hillsChance}
                step="0.01"
                max="1"
                min="0"
        />
        <label>PlateuChance: {plateuChance}</label>
        <input
                class="basic-range"
                type="range"
                bind:value={plateuChance}
                step="0.01"
                max="1"
                min="0"
        />
        <label>HighPeaksChance: {highPeaksChance}</label>
        <input
                class="basic-range"
                type="range"
                bind:value={highPeaksChance}
                step="0.01"
                max="1"
                min="0"
        />
    </Param>

    <button class="menu-but center-text"
            on:click={Generate}>
        <span>Generate</span>
    </button>
</div>