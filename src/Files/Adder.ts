import {Heightmap} from "../Terrain/Heightmap";
import {importMap} from "./Importer";

export default async function AddMap(heightMap:Heightmap): Promise<Heightmap>{
    let importedHeightmap;
    try {
        importedHeightmap = await importMap()
    }catch (err){
        throw  new Error(err);
    }
    let dif = Math.max(heightMap.size, importedHeightmap.size) - Math.min(heightMap.size, importedHeightmap.size);

    return new Heightmap();
}