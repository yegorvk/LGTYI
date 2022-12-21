import type {SaveData} from "../types/SaveData";
import {Heightmap} from "../Terrain/Heightmap";

const remote = require('@electron/remote');


export async function importMap(): Promise<SaveData> {

    const fs = window.require('fs');
    // Use the electron dialog module to prompt the user for a file path
    const {filePaths} = await remote.dialog.showOpenDialog({
        filters: [{name: 'JSON Files', extensions: ['json']}],
        properties: ['openFile']
    });
    // Exit the function if the user cancels the save dialog
    if (!filePaths) return;
    // Use the electron fs module to write an empty string to the specified file
    try {
        let file = await fs.promises.readFile(filePaths[0], 'utf8');

        let Data: SaveData = JSON.parse(file);

        if (!(Data.heightMap.offsetX === undefined ||
            Data.heightMap.offsetY === undefined ||
            Data.heightMap.width === undefined ||
            Data.heightMap.height === undefined ||
            Data.heightMap.data === undefined ||
            Data.viewMode === undefined ||
            Data.genOptions.seed === undefined ||
            Data.genOptions.levelOfDetail === undefined ||
            Data.genOptions.roughnessCoefficient === undefined ||
            Data.genOptions.maxAltitude === undefined ||
            Data.genOptions.minAltitude === undefined ||
            Data.genOptions.width === undefined ||
            Data.genOptions.height === undefined)) {
            let arr = new Float32Array(Data.heightMap.width * Data.heightMap.height);
            let i = 0;
            for (let key of Object.values(Data.heightMap.data)) {
                arr[i] = key;
                i++;
            }
            Data.heightMap.data = arr;
            Data.heightMap = new Heightmap(Data.heightMap.width, Data.heightMap.height, Data.heightMap.data, Data.heightMap.offsetX, Data.heightMap.offsetY);
            return Data;
        } else {
            throw new Error('Invalid Data');
        }

    } catch (err) {
        throw new Error(err);
    }

}