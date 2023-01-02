import {Heightmap} from "../Terrain/Heightmap";
import {altitudeFromGrayscale} from "../Terrain/PointColor";
import type {Color} from "../types/Color";
import type {GrayscaleColor} from "../types/GrayscaleColor";
import {DefaultGeneratorOptions} from "../Generator/GeneratorOptions";

const remote = require('@electron/remote');

export async function ImageImport(isAlphaMod: boolean, isColorMod: boolean, color: Color, grayscaleColor: GrayscaleColor, waterLevel: number, isInverted: boolean): Promise<Heightmap> {
    const Jimp = window.require('jimp');

    // Use the electron dialog module to prompt the user for a file path
    const {filePaths} = await remote.dialog.showOpenDialog({
        filters: [
            {name: 'Image Files', extensions: ['jpg', 'jpeg', 'bmp', 'png']},
        ],
        properties: ['openFile']
    });
    // Exit the function if the user cancels the save dialog
    if (!filePaths) throw new Error('No file selected');
    let promise: Promise<Heightmap>;
    try {
        promise = Jimp.read(filePaths[0]).then(img => {
            img.flip(false, true, function (err) {
                if (err) throw err;
            })
            let arr = new Float32Array(img.bitmap.width * img.bitmap.height);
            const maxAltitude = DefaultGeneratorOptions.maxAltitude;
            const minAltitude = DefaultGeneratorOptions.minAltitude;
            const HeightmapRandom = Heightmap.generate({
                width: img.bitmap.width,
                height: img.bitmap.height,
                minAltitude: minAltitude,
                maxAltitude: maxAltitude,
                roughness: DefaultGeneratorOptions.roughness,
                levelOfDetail: DefaultGeneratorOptions.levelOfDetail,
                waterLevel: DefaultGeneratorOptions.waterLevel,
                seed: DefaultGeneratorOptions.seed
            });
            let altitude: number;
            img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
                const red = this.bitmap.data[idx + 0];
                const green = this.bitmap.data[idx + 1];
                const blue = this.bitmap.data[idx + 2];
                let alpha = this.bitmap.data[idx + 3];

                if (isColorMod && red == color.r && green == color.g && blue == color.b) {
                    altitude = HeightmapRandom.data[y * img.bitmap.width + x];
                } else {
                    switch (grayscaleColor) {
                        case "red": {
                            altitude = altitudeFromGrayscale(red);
                            break;
                        }
                        case "green": {
                            altitude = altitudeFromGrayscale(green);
                            break;
                        }
                        case "blue": {
                            altitude = altitudeFromGrayscale(blue);
                            break;
                        }
                    }
                }
                /*if (isAlphaMod){
                    if (!isInverted)
                        altitude =  altitude + alpha*((HeightmapRandom.data[y * img.bitmap.width + x] - altitude)/255);
                    else
                        altitude =  altitude + (255 - alpha) * ((HeightmapRandom.data[y * img.bitmap.width + x] - altitude)/255);
                }*/

                alpha /= 255;

                if (isInverted)
                    alpha = 1 - alpha;

                if (isAlphaMod)
                    altitude = (1-alpha)*altitude + alpha*HeightmapRandom.data[y*img.bitmap.width+x];

                arr[y * img.bitmap.width + x] = altitude;
            });

            let heightMap = new Heightmap(img.bitmap.width, img.bitmap.height, arr, waterLevel);
            return heightMap;
        })
    } catch (e) {
        throw new Error(e);
    }
    return promise;
}