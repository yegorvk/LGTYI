import type {Heightmap} from "../Terrain/Heightmap";
import {importMap} from "./Importer";

export default async function SubtructMap(heightMap: Heightmap): Promise<Heightmap>{
    let importedHeightmap;
    try {
        importedHeightmap = await importMap()
    } catch (err) {
        throw  new Error(err);
    }
    let dif = (Math.max(heightMap.size, importedHeightmap.size) - Math.min(heightMap.size, importedHeightmap.size)) / 2;
    if (heightMap.size < importedHeightmap.size) {
        for (let i = 0; i < heightMap.size; i++) {
            for (let j = 0; j < heightMap.size; j++) {
                heightMap.data[j] -= importedHeightmap.data[j + dif + dif * importedHeightmap.size + i * (heightMap.size + 2 * dif)];
            }
        }
        return importedHeightmap;
    } else {
        for (let i = 0; i < importedHeightmap.size; i++) {
            for (let j = 0; j < importedHeightmap.size; j++) {
                heightMap.data[j + dif + dif * heightMap.size + i * (importedHeightmap.size + 2 * dif)] -= importedHeightmap.data[j];
            }
        }
        return heightMap;
    }

}