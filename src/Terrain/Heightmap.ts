import { applyDefaults } from "../Defaults";
import { DefaultGeneratorOptions, type GeneratorOptions } from "../Generator/GeneratorOptions";
import { generateTerrain, generateSimpleTerrain } from "../Generator/Generator";

export class Heightmap {
    width: number;
    height: number;

    /**
     *  Heightmap data (row-major order).
     *  Just stores heights in format
     *  y1: `x1 x2 x3 x4 x5`
     *  y2: `x1 x2 x3 x4 x5`
     *
     *  To get to a needed coordinate, simply use the following equation `index = y * width  + x`;
     * */
    data: Float32Array;

    // TODO create a separate class that will hold all map data (heightmap will be part of it)
    waterLevel: number = DefaultGeneratorOptions.waterLevel;

    /**
     *  Generates a Heightmap from the Generator options __without a biomes__.
     *
     *  @deprecated
     *
     *  @return Heightmap
     * */
    static generate(
        options: GeneratorOptions
    ): Heightmap {
        applyDefaults(options, DefaultGeneratorOptions);

        const heightmap = Heightmap.flat(options.width, options.height, 0, options.waterLevel);
        generateTerrain(heightmap, options);

        return heightmap;
    }
    /**
     *  Generates a Heightmap from the Generator options.
     *
     *  @return Heightmap
     * */
    static simpleGenerate(
        options: GeneratorOptions
    ): Heightmap {
        applyDefaults(options, DefaultGeneratorOptions);

        const heightmap = Heightmap.flat(options.width, options.height, 0, options.waterLevel);
        generateSimpleTerrain(heightmap, options);

        return heightmap;
    }
    /**
     *  Generates a flat Heightmap from the Params.
     *
     *  @return Heightmap
     * */
    static flat(width: number, height: number, fillValue: number = 0, waterLevel: number = -1) {
        const data = new Float32Array(width*height)

        if (fillValue !== 0)
            data.fill(fillValue)

        return new Heightmap(width, height, data, waterLevel)
    }

    constructor(
        width: number,
        height: number,
        data: Float32Array,
        waterLevel: number
    ) {
        this.width = width;
        this.height = height;
        this.data = data
        this.waterLevel = waterLevel;
    }
}