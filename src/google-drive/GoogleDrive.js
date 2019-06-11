const fs = require('fs');
const readline = require('readline');
const path = require('path');

const { google } = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

module.exports = class {
    constructor(clientId, clientSecret, mimeType = 'text/plain', folderId = '') {
        this.clientId = clientId;
        this.clientSecret = clientSecret;

        this.mimeType = mimeType;
        this.folderId = folderId;
    }

    authorize() {
        const oAuth2 = new google.auth.OAuth2(this.clientId, this.clientSecret);

        return new Promise((resolve, reject) => {
            fs.readFile(TOKEN_PATH, (err, token) => {
                if (err) {
                    return reject(new Error(`Error reading access token. ${err}`));
                }

                oAuth2.setCredentials(JSON.parse(token));

                return resolve(oAuth2);
            });
        });
    }

    uploadFile(auth, filePath) {
        return new Promise((resolve, reject) => {
            const name = path.parse(filePath).base;
            const resource = {
                name,
                parents: [this.folderId]
            };
            const media = {
                mimeType: this.mimeType,
                body: fs.createReadStream(filePath)
            };

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
            scope: SCOPES
        });

        console.log('Authorize this app by visiting this url:', authUrl);

        return new Promise((resolve, reject) => {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question('Enter the code from that page here: ', (code) => {
                rl.close();
                oAuth2Client.getToken(code, (err, token) => {
                    if (err) {
                        return reject(new Error(`Error retrieving access token. ${err}`));
                    }

                    oAuth2Client.setCredentials(token);
                    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (e) => {
                        if (e) {
                            return reject(e);
                        }

                        return console.log('Token stored to', TOKEN_PATH);
                    });

                    return resolve(oAuth2Client);
                });
            });
        });
    }
};
