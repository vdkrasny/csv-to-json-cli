const fs = require('fs');
const CsvToJsonStream = require('./CsvToJsonStream');

module.exports = (csvFilePath, jsonFilePath, separator) => new Promise((resolve, reject) => {
    console.log('The conversion process is started...');

    fs.createReadStream(csvFilePath)
        .on('error', err => reject(err))
        .pipe(new CsvToJsonStream(separator))
        .pipe(fs.createWriteStream(jsonFilePath))
        .on('finish', () => {
            console.log(`The file ${csvFilePath} has been successfully converted to ${jsonFilePath}`);

            return resolve();
        });
});
