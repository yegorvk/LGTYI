import type {Heightmap} from "../Terrain/Heightmap";
const remote = require('@electron/remote');

export async function ExcelExport(heightMap: Heightmap) {
    try {
        const {filePath} = await remote.dialog.showSaveDialog({
            filters: [{name: 'Excel Files', extensions: ['xlsx']}]
        });
        if (!filePath) {
            throw new Error('No file selected');
        }

        const fs = window.require('fs');
        const ExcelJS = window.require('exceljs');
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Coords');
        let columnArr: any[] = [];
        columnArr.push("Coordinate")
        for (let i = 1; i < heightMap.width; i++) {
            columnArr.push(i - 1);
        }
        sheet.addRow(columnArr);
        columnArr = [];
        for (let i = 0; i < heightMap.height; i++){
            columnArr.push(i);
            for (let j = 0; j < heightMap.width; j++) {
                columnArr.push(heightMap.data[j + i * heightMap.width]);
            }
            sheet.addRow(columnArr);
            columnArr = [];
        }


        await workbook.xlsx.writeFile(filePath);

    } catch (err){
        throw new Error(err);
    }

}