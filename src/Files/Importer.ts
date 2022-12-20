import {Heightmap} from "../Terrain/Heightmap";
const remote = require('@electron/remote');


export async function importMap() {
    interface readData{
        size: number,
        data: Float32Array,
        offsetX: number,
        offsetY: number
    }
    const fs = window.require('fs');
    // Use the electron dialog module to prompt the user for a file path
    const {filePath} = await remote.dialog.showOpenDialog({
        filters: [{name: 'JSON Files', extensions: ['json']}]
    });

    // Exit the function if the user cancels the save dialog
    if (!filePath) return;

    // Use the electron fs module to write an empty string to the specified file
    fs.readFile(filePath, (error, data) => {
        if (error) {
            // Handle the error
            console.error(error);
        } else {
            let Data: readData = JSON.parse(data);
            if (Data.offsetX === undefined || Data.offsetY === undefined || Data.size === undefined || Data.data === undefined || Data.data.length !== Data.size*Data.size) {
                throw new Error("Invalid file format");
            }
            return new Heightmap(Data.size, Data.data, Data.offsetX, Data.offsetY);
        }
    });

}