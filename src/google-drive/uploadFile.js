const GoogleDrive = require('./GoogleDrive');

module.exports = async (filePath) => {
    const googleDrive = new GoogleDrive(
        '734711208659-fd8vpk6pkgct6n1ffgqos0pdphllghgi.apps.googleusercontent.com',
        'pOfK550huzVrAL_27UGJ5Q-E',
        'tapplication/json',
        '1J4mTT80RQgFuNf8JTKg67sqwSObtjL38'
    );

    console.log('The process of uploading to Google Drive is started...');
    const auth = await googleDrive.authorize();
    await googleDrive.uploadFile(auth, filePath);
    console.log('The file is uploaded successfully. Get access here: https://drive.google.com/drive/folders/1J4mTT80RQgFuNf8JTKg67sqwSObtjL38');
};
