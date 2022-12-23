//import { app } from "electron";

//import { require } from "@electron/remote"

/*const path = require('path')

const ASSET_PATH = app.isPackaged ?
    path.join(process.resourcesPath, 'assets') :
    path.join(app.getAppPath(), `public${path.sep}assets`)

export const WATER_NORM = path.join(ASSET_PATH, 'textures/water_norm.jpg')*/

const remote = require('@electron/remote')
const path = require('path')

const ASSET_PATH: string = remote.app.isPackaged ?
    path.join(remote.process.resourcesPath, 'assets') :
    path.join(remote.app.getAppPath(), `public${path.sep}assets`)

const ASSET_PATH = path.join(__dirname, 'public/assets')

export const WATER_NORM: string = path.join(ASSET_PATH, 'textures/water_norm.jpg')

