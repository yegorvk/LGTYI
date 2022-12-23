import type {Heightmap} from "../Terrain/Heightmap";

const remote = require('@electron/remote');

export async function ImageExport(pixels: Uint8ClampedArray, heightMap: Heightmap) {

    const Jimp = window.require('jimp');


    // Use the electron dialog module to prompt the user for a file path
    const {filePath} = await remote.dialog.showSaveDialog({
        filters: [
            {name: 'PNG Files', extensions: ['png']},
            {name: 'BMP Files', extensions: ['bmp']},
            {name: 'JPEG Files', extensions: ['jpg']},
        ],
        defaultPath: "project.png"
    });
    // Exit the function if the user cancels the save dialog
    if (!filePath) throw new Error('No file selected');
    let promise: Promise<void>;
    try {
        const buffer = new Buffer(pixels);
        promise = new Jimp({data: buffer, width: heightMap.width, height: heightMap.height}, (err, image) => {
            image.writeAsync(filePath)
        });
    } catch (e) {
        throw new Error(e);
    }
    return promise;
}