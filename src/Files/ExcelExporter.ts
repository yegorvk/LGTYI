import type {Heightmap} from "../Terrain/Heightmap";
export default async function ExcelExport(heightMap: Heightmap) {
    const fs = window.require('fs');
    const ExcelJS = window.require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('My Sheet');
    let columnArr : number[] = [];
    for (let i = 0; i < heightMap.height; i){
        for (let j = 0; j < heightMap.width; j++) {

        }
    }

}