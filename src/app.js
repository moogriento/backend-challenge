const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');

const { init } = require('./config/mongo');
const { processUpload } = require('./controllers/upload.controller');

const app = express();

app.use(fileUpload());

app.get('/', function (req, res) {
  res.send('It works.');
});

app.post('/upload', function(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const provider = req.body.provider;
  const csvFile = req.files.csvFile;
  const processId = Date.now(); // could be UUID

  const savedPath = path.resolve(__dirname, `../uploads/${processId}_${csvFile.name}`);

  csvFile.mv(savedPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    try {
      // Call to pprocess without waiting...
      processUpload(savedPath, provider, processId);
    } catch (error) {
      console.error(error);
    }

    // Respond back to the client as soon as the file was saved.
    // No need to wait until the process finishes
    // Here we could send a process id generated to track the progess
    return res.status(200).json({
      message: 'File Uploaded',
      trackId: processId,
    });
  });
});


(async () => {
  await init();

  app.listen(3000, function () {
    console.log('Listening on port 3000');
  });
})();
