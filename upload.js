const PIXELS = 100;
const path = require('path');
const fsp = require('fs-promise');
const { v4 } = require('node-uuid');
const { PDFImage } = require('pdf-image');
const sharp = require('sharp');
const globals = require('./globals');
const { rootDirPath, db } = globals;
const upload = (req, res) => {
  const file = req.file;
  if (file === undefined) return res.status(400).send('no file');
  const { ext } = path.parse(file.originalname);
  if (ext !== '.pdf') return res.status(400).send('not pdf');
  const tmpFilePath = file.path;
  const tmpPngPath = `${tmpFilePath}-0.png`;
  const fileName =  v4();
  let pdf;
  // PDF TO PNG
  (new PDFImage(tmpFilePath)).convertPage(0)
  // PNG TO THUMBNAIL
    .then(() => new Promise((resolveResize, rejectResize) => sharp(tmpPngPath)
      .resize(null, PIXELS)
      .toFile(path.join(rootDirPath, 'upload', `${fileName}.png`), (err) => {
        if (err !== null) return rejectResize();
        resolveResize();
      })
    ))
  // COPY PDF
    .then(() => fsp.copy(tmpFilePath, path.join(rootDirPath, 'upload', `${fileName}.pdf`)))
  // UPDATE DATABASE
  // TODO: REPLACE WITH PERFORMANT DATABASE
    .then(() => {
      pdf = {
        id: fileName,
        url: `http://localhost/upload/${fileName}.pdf`,
        thumbnailUrl: `http://localhost/upload/${fileName}.png`
      };
      globals.pdfs.push(pdf);
      db.put('pdfs', globals.pdfs);
    })
    .then(() => res.send(pdf))
    .catch(() => res.status(500).send('unexpected'))
    .then(() => fsp.remove(tmpFilePath))
    .then(() => fsp.remove(tmpPngPath))
    .catch(() => {});
}
module.exports = upload;
