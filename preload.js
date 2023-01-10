const { remote } = require('electron');
window.remote = remote;

const fs = require('fs');
window.fs = fs;

const ExcelJS = require('exceljs');
window.exceljs = ExcelJS;

const Jimp = require('jimp');
window.jimp = Jimp;

const CryptoJS = require("crypto-js");
window.cryptojs = CryptoJS;
