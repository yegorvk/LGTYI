import type {SaveData} from "../Types/SaveData";
import {Heightmap} from "../Terrain/Heightmap";
import CryptoJS from 'crypto-js';
import type {GeneratorOptions} from "../Generator/GeneratorOptions";
import {DefaultGeneratorOptions} from "../Generator/GeneratorOptions";

const remote = require('@electron/remote');

/**
 * Opens data from `.txt` file.
 *
 * @returns GeneratorOptions.
 * */
export async function importFromFile(): Promise<GeneratorOptions> {
    // @ts-ignore
    const fs = window.fs;
    // Use the electron dialog module to prompt the user for a file path
    const {filePaths} = await remote.dialog.showOpenDialog({
        filters: [
            {name: 'LGTYI Files', extensions: ['txt']},
        ],
        properties: ['openFile']
    });
    // Exit the function if the user cancels the save dialog
    if (filePaths.length === 0) throw new Error("File was not selected!");
    // Use the electron fs module to write an empty string to the specified file
    try {
        let file = await fs.promises.readFile(filePaths[0], 'utf8');


        let Data = file.split('\n');

        if (Data.length === 5) {

            let genOpt: GeneratorOptions = DefaultGeneratorOptions;
            genOpt.width = Data[0];
            genOpt.height = Data[1];
            genOpt.maxAltitude = Data[2];
            genOpt.minAltitude = Data[3];
            genOpt.roughness = Data[4] / 100;

            return Data;
        } else {
            throw new Error('Invalid Data');
        }

    } catch (err) {
        throw new Error(err);
    }

}