import type {Heightmap} from "../Terrain/Heightmap";
import type {GeneratorOptions} from "../Generator/GeneratorOptions";

export interface SaveData {
    heightMap: {
        width: number,
        height: number,
        data: Float32Array,
    };
    viewMode: boolean;
    genOptions: GeneratorOptions;
}