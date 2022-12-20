import type {Heightmap} from "../Terrain/Heightmap";
const remote = require('@electron/remote');

export async function exportMap(heightMap: Heightmap) {
        const fs = window.require('fs');
        // Use the electron dialog module to prompt the user for a file path
        const {filePath} = await remote.dialog.showSaveDialog({
            filters: [{name: 'JSON Files', extensions: ['json']}]
        });

        // Exit the function if the user cancels the save dialog
        if (!filePath) return;

        // Use the electron fs module to write an empty string to the specified file
        fs.writeFile(filePath, JSON.stringify(heightMap, null, 2), 'utf8', (error) => {
            if (error) {
                // Handle the error
                console.error(error);
            } else {
                // The file was saved successfully
                console.log(`Saved empty text file to ${filePath}`);
            }
        });

}