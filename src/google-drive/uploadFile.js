const GoogleDrive = require('./GoogleDrive');

const { googleDrive: { clientId, clientSecret, folderId } } = require('../../constants');

module.exports = async (filePath) => {
    const googleDrive = new GoogleDrive(clientId, clientSecret, folderId, 'application/json');

    console.log('The process of uploading to Google Drive is started...');
    const auth = await googleDrive.authorize();
    await googleDrive.uploadFile(auth, filePath);
    console.log(`The file is uploaded successfully. Get access here: https://drive.google.com/drive${folderId ? `/folders/${folderId}` : '/'}`);
};
