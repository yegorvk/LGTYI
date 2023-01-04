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
    let swampChance = eventHandler.generatorOptions.biomes.swampChance;
    let plainsChance = eventHandler.generatorOptions.biomes.plainsChance;
    let hillsChance = eventHandler.generatorOptions.biomes.hillsChance;
    let plateuChance = eventHandler.generatorOptions.biomes.plateuChance;
    let lakeChance = eventHandler.generatorOptions.biomes.lakeChance;
    let highPeaksChance = eventHandler.generatorOptions.biomes.highPeaksChance;

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
                    plateauChance,
                    lakeChance,
                    highPeaksChance
                },
                numberOfBiomes: numberOfBiomes
            }
        );
        eventHandler.generatorOptions = {
            width: width,
            height: height,
            maxAltitude: maxAltitude,
            minAltitude: minAltitude,
            roughness: roughness,
            levelOfDetail: levelOfDetail,
            seed: seed,
            waterLevel: waterLevel,
            biomes: {
                oceanChance,
                seaChance,
                swampChance,
                plainsChance,
                hillsChance,
                plateauChance,
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
        <label for="generateSeed">Seed: {(seed === null || seed === 0) ? "random" : seed.toString()}</label>
        <input id="generateSeed"
               class="basic-text"
               type="number"
               min="0"
               bind:value={seed}
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
        <label for="generateNumberOfBiomes">Number of biomes: {numberOfBiomes}</label>
        <input id="generateNumberOfBiomes"
               class="basic-range"
               type="range"
               bind:value={numberOfBiomes}
               max="50"
               min="1"
        />
    </Param>

    <Param>
        <h3>Biomes</h3>
        <hr/>
        <label for="generateOceanChance">Ocean chance: {oceanChance}</label>
        <input id="generateOceanChance"
               class="basic-range"
               type="range"
               bind:value={oceanChance}
               step="0.01"
               max="1"
               min="0"
        />

        <label for="generateSeaChance">Sea chance: {seaChance}</label>
        <input id="generateSeaChance"
               class="basic-range"
               type="range"
               bind:value={seaChance}
               step="0.01"
               max="1"
               min="0"
        />

        <label for="generateSwampChance">Swamp chance: {swampChance}</label>
        <input id="generateSwampChance"
                class="basic-range"
                type="range"
                bind:value={swampChance}
                step="0.01"
                max="1"
                min="0"
        />

        <label for="generateLakeChance">Lake chance: {lakeChance}</label>
        <input id="generateLakeChance"
                class="basic-range"
                type="range"
                bind:value={lakeChance}
                step="0.01"
                max="1"
                min="0"
        />

        <label for="generatePlainsChance">Plains chance: {plainsChance}</label>
        <input id="generatePlainsChance"
               class="basic-range"
               type="range"
               bind:value={plainsChance}
               step="0.01"
               max="1"
               min="0"
        />

        <label for="generateHillsChance">Hills chance: {hillsChance}</label>
        <input id="generateHillsChance"
               class="basic-range"
               type="range"
               bind:value={hillsChance}
               step="0.01"
               max="1"
               min="0"
        />

        <label for="generatePlateauChance">Plateau chance: {plateauChance}</label>
        <input id="generatePlateauChance"
               class="basic-range"
               type="range"
               bind:value={plateauChance}
               step="0.01"
               max="1"
               min="0"
        />

        <label for="generateHighPeaksChance">High peaks chance: {highPeaksChance}</label>
        <input id="generateHighPeaksChance"
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