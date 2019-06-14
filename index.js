const argValidator = require('./src/argValidator');
const convertCsvToJson = require('./src/convertCsvToJson');
const googleDriveUploadFile = require('./src/google-drive/uploadFile');

const { googleDrive: { folderId } } = require('./constants');

(async () => {
    try {
        const { sourceFilePath, resultFilePath, separator } = argValidator(process.argv.slice(2));

        console.log(`The file ${sourceFilePath} has been successfully converted to ${resultFilePath}`);
        await convertCsvToJson(sourceFilePath, resultFilePath, separator);
        console.log('The conversion process is started...');

        console.log('The process of uploading to Google Drive is started...');
        await googleDriveUploadFile(resultFilePath);
        console.log(`The file is uploaded successfully. Get access here: https://drive.google.com/drive${folderId ? `/folders/${folderId}` : '/'}`);
    } catch (err) {
        console.error(`${err.message}`);
    }
})();
