const fs = require('fs');
const readline = require('readline');
const path = require('path');

const { google } = require('googleapis');

const { googleDrive: { scopes, redirectUri } } = require('../../constants');

module.exports = class GoogleDrive {
    constructor(clientId, clientSecret, folderId = null, mimeType = 'text/plain') {
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.folderId = folderId;
        this.mimeType = mimeType;

        this._scopes = scopes;
        this._redirectUri = redirectUri;
        this._tokenPath = path.join(__dirname, 'token.json');
    }

    authorize() {
        const oAuth2 = new google.auth.OAuth2(this.clientId, this.clientSecret, this._redirectUri);

        return new Promise((resolve, reject) => {
            fs.readFile(this._tokenPath, async (err, token) => {
                if (err) {
                    await this._createAccessToken(oAuth2);

                    return reject(new Error('Please, try again.'));
                }

                oAuth2.setCredentials(JSON.parse(token));

                return resolve(oAuth2);
            });
        });
    }

    uploadFile(auth, filePath) {
        return new Promise((resolve, reject) => {
            const name = path.parse(filePath).base;
            const resource = { name };
            const media = {
                mimeType: this.mimeType,
                body: fs.createReadStream(filePath)
            };

            if (this.folderId) {
                resource.parents = [this.folderId];
            }

            console.log(resource);

            google.drive('v3').files.create({ auth, resource, media }, (err) => {
                if (err) {
                    return reject(err);
                }

                return resolve();
            });
        });
    }

    _createAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: this._scopes
        });

        console.log('Authorize this app by visiting this url:', authUrl);

        return new Promise((resolve, reject) => {
            const readlineInterface = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            readlineInterface.question('Enter the code from that page here: ', (code) => {
                readlineInterface.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) {
                        return reject(new Error(`Error retrieving access token. ${err}`));
                    }

                    oAuth2Client.setCredentials(token);
                    fs.writeFile(this._tokenPath, JSON.stringify(token), (e) => {
                        if (e) {
                            return reject(e);
                        }

                        return console.log('Token stored to', this._tokenPath);
                    });

                    return resolve(oAuth2Client);
                });
            });
        });
    }
};
