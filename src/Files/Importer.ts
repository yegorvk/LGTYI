import {Heightmap} from "../Terrain/Heightmap";
const remote = require('@electron/remote');


export async function importMap(): Promise<Heightmap> {
    interface readData{
        width: number,
        height: number,
        data: Float32Array,
        offsetX: number,
        offsetY: number
    }
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
        let file = await fs.promises.readFile(filePaths[0],'utf8');

        let Data: readData = JSON.parse(file);

        if (!(Data.offsetX === undefined || Data.offsetY === undefined || Data.width === undefined || Data.height === undefined || Data.data === undefined )) {
            let arr = new Float32Array(Data.width*Data.height);
            let i = 0;
            for(let key of Object.values(Data.data)) {
                arr[i] = key;
                i++;
            }
            Data.data = arr;
            return new Heightmap(Data.width, Data.height, Data.data, Data.offsetX, Data.offsetY);
        }else {
            throw new Error('Invalid Data');
        }

    }catch (err){
       throw new Error(err);
    }

}