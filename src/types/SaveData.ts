import type {Heightmap} from "../Terrain/Heightmap";
import type {GeneratorOptions} from "../Generator/GeneratorOptions";
import type { RenderSettings } from "../Renderer/RenderSettings";

export interface SaveData {
    renderSettings: RenderSettings ;
    viewMode: boolean;
    genOptions: GeneratorOptions;
    heightMap: {
        width: number,
        height: number,
        data: Float32Array,
    };

}