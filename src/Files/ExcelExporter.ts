import type {Heightmap} from "../Terrain/Heightmap";
const remote = require('@electron/remote');

export default async function ExcelExport(heightMap: Heightmap) {
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
        const sheet = workbook.addWorksheet('My Sheet');
        let columnArr : number[] = [];
        for (let i = 0; i < heightMap.height; i){
            for (let j = 0; j < heightMap.width; j++) {
                columnArr.push(heightMap.data[j + i * heightMap.width]);
            }
            sheet.addRow(columnArr);
            columnArr = [];
        }
        return;
        await workbook.xlsx.writeFile(filePath);

    } catch (err){
        throw new Error(err);
    }

}