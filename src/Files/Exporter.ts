import type {Heightmap} from "../Terrain/Heightmap";
import type {GeneratorOptions} from "../Generator/GeneratorOptions";
import type {SaveData} from "../Types/SaveData";
import type {UIEventsHandler} from "../Components/UI/UIEventsHandler";
import CryptoJS from 'crypto-js';

const remote = require('@electron/remote');

export async function exportMap(heightMap: Heightmap, eventHandler: UIEventsHandler, is2d: boolean) {
    // @ts-ignore
    const fs = window.fs;
    const data: SaveData = {
        renderSettings: eventHandler.renderTrueSettings,
        genOptions: eventHandler.generatorOptions,
        viewMode: is2d,
        heightMap: {
            width: heightMap.width,
            height: heightMap.height,
            data: heightMap.data,
        },

    };

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data, null, 2), "LGTYI_KEY").toString();


    // Use the electron dialog module to prompt the user for a file path
    const {filePath} = await remote.dialog.showSaveDialog({
        filters: [
            {name: 'LGTYI Files', extensions: ['lgtyi']},
        ],
        defaultPath: "project.lgtyi"
    });

    // Exit the function if the user cancels the save dialog
    if (!filePath) throw new Error('No file selected');

    // Use the electron fs module to write an empty string to the specified file
    fs.writeFile(filePath, encrypted, 'utf8', (error) => {
        if (error) {
            // Handle the error
            throw new Error(error);
        } else {
            // The file was saved successfully
            return;
        }
    });

}