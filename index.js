const argValidator = require('./src/argValidator');
const convertCsvToJson = require('./src/convertCsvToJson');
const googleDriveUploadFile = require('./src/google-drive/uploadFile');

(async () => {
    try {
        const { sourceFilePath, resultFilePath, separator } = argValidator(process.argv.slice(2));

        await convertCsvToJson(sourceFilePath, resultFilePath, separator);
        await googleDriveUploadFile(resultFilePath);
    } catch (err) {
        console.error(`${err.message}`);
    }
})();
