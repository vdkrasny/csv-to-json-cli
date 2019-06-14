const GoogleDrive = require('./GoogleDrive');

const { googleDrive: { clientId, clientSecret, folderId } } = require('../../constants');

module.exports = async (filePath) => {
    const googleDrive = new GoogleDrive(clientId, clientSecret, folderId, 'application/json');

    const auth = await googleDrive.authorize();
    await googleDrive.uploadFile(auth, filePath);
};
