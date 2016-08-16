const express = require('express');
const { json, urlencoded } = require('body-parser');
const multer = require('multer');
const allowCrossDomain = require('./allowCrossDomain');
const noCache = require('./noCache');
const globals = require('./globals');
const upload = require('./upload');
const { db, tempDirPath } = globals;
db.on('open', () => {
  globals.pdfs = db.get('pdfs');
  if (globals.pdfs === undefined) {
    globals.pdfs = [];
    db.put('pdfs', globals.pdfs);
  }
  const app = express();
  app.use(json());
  app.use(urlencoded({ extended: true }));
  app.use(allowCrossDomain);
  app.use(noCache);
  app.get('/api/pdfs', (req, res) => {
      res.send(globals.pdfs);
  });
  app.post('/api/pdfs/',
    multer({ dest: tempDirPath }).single('file'),
    upload);
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
});
