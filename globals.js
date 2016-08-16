const flatfile = require('flat-file-db');
const path = require('path');
const globals = {};
// TODO: GET FROM CONFIG
const rootDirPath = '/home/sckmkny/Documents/root';
const tempDirPath = '/home/sckmkny/Documents/tmp';
// TODO: REPLACE WITH PERFORMANT DATABASE
const db = flatfile(path.join(rootDirPath, 'app.db'));
let pdfs;
globals.rootDirPath = rootDirPath;
globals.tempDirPath = tempDirPath;
globals.db = db;
globals.pdfs = pdfs;
module.exports = globals;
