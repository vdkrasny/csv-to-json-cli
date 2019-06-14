const fs = require('fs');
const CsvToJsonStream = require('./CsvToJsonStream');

module.exports = (csvFilePath, jsonFilePath, separator) => new Promise((resolve, reject) => {
    const csvReadStream = fs.createReadStream(csvFilePath, { encoding: 'utf8' });
    const csvToJsonStream = new CsvToJsonStream(separator);
    const jsonWriteStream = fs.createWriteStream(jsonFilePath, { encoding: 'utf8' });

    csvReadStream.on('error', err => reject(err));
    csvToJsonStream.on('error', err => reject(err));
    jsonWriteStream.on('error', err => reject(err));

    const converterStream = csvReadStream
        .pipe(csvToJsonStream)
        .pipe(jsonWriteStream);

    converterStream.on('finish', () => resolve());
});
