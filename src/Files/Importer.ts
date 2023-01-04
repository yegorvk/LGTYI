import type {SaveData} from "../Types/SaveData";
import {Heightmap} from "../Terrain/Heightmap";

const remote = require('@electron/remote');


export async function importMap(): Promise<SaveData> {

    // @ts-ignore
    const fs = window.fs;
    // Use the electron dialog module to prompt the user for a file path
    const {filePaths} = await remote.dialog.showOpenDialog({
        filters: [
            { name: 'LGTYI Files', extensions: ['lgtyi'] },
        ],
        properties: ['openFile']
    });
    // Exit the function if the user cancels the save dialog
    if (filePaths.length === 0) throw new Error("File was not selected!");
    // Use the electron fs module to write an empty string to the specified file
    try {
        let file = await fs.promises.readFile(filePaths[0], 'utf8');

        let Data: SaveData = JSON.parse(file);

        if (!(Data.heightMap.width === undefined ||
            Data.heightMap.height === undefined ||
            Data.heightMap.data === undefined ||
            Data.viewMode === undefined ||
            Data.genOptions.seed === undefined ||
            Data.genOptions.levelOfDetail === undefined ||
            Data.genOptions.roughness === undefined ||
            Data.genOptions.maxAltitude === undefined ||
            Data.genOptions.minAltitude === undefined ||
            Data.genOptions.waterLevel === undefined ||
            Data.genOptions.width === undefined ||
            Data.genOptions.height === undefined ||
            Data.renderSettings.wireframeOpacity === undefined ||
            Data.renderSettings.wireframeLineWidth === undefined ||
            Data.renderSettings.wireframe === undefined ||
            Data.renderSettings.dynamicScene === undefined ||
            Data.renderSettings.lighting === undefined ||
            Data.renderSettings.gradient === undefined )) {
            let arr = new Float32Array(Data.heightMap.width * Data.heightMap.height);
            let i = 0;
            for (let key of Object.values(Data.heightMap.data)) {
                arr[i] = key;
                i++;
            }
            Data.heightMap.data = arr;
            Data.heightMap = new Heightmap(Data.heightMap.width, Data.heightMap.height, Data.heightMap.data, Data.genOptions.waterLevel);
            return Data;
        } else {
            throw new Error('Invalid Data');
        }

    } catch (err) {
        throw new Error(err);
    }

}