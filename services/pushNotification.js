const https = require('https');
const {
    google
} = require('googleapis');

const PROJECT_ID = 'office-tracking-573d6';
const HOST = 'fcm.googleapis.com';
const PATH = `/v1/projects/${PROJECT_ID}/messages:send`;
const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const SCOPES = [MESSAGING_SCOPE];

const getAccessToken = () => {
    return new Promise((resolve, reject) => {
        var key = require('../office-tracking-573d6-firebase-adminsdk-a1gd1-a45a13e5b1.json');
        var jwtClient = new google.auth.JWT(
            key.client_email,
            null,
            key.private_key,
            SCOPES,
            null
        );
        jwtClient.authorize((err, tokens) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(tokens.access_token);
        });
    });
};

exports.sendFcmMessageToUser = (fcmMessage) => {
    getAccessToken().then(accessToken => {
        var options = {
            hostname: HOST,
            path: PATH,
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        };

        var request = https.request(options, resp => {
            resp.setEncoding('utf8');
            resp.on('data', data => {
                console.log('Message sent to Firebase for delivery, response:');
                console.log(data);
            });
        });

        request.on('error', err => {
            console.log('Unable to send message to Firebase');
            console.log(err);
        });

        request.write(JSON.stringify({
            "message": {
                "notification": {
                    "title": fcmMessage.title.toString(),
                    "body": fcmMessage.body.toString()
                },
                "data": {
                    "channel_id": "UserReminder",
                },
                "android": {
                    "notification": {
                        "title": fcmMessage.title.toString(),
                        "body": fcmMessage.body.toString(),
                        "channel_id": "UserReminder"
                    },
                    "data": {
                        "channel_id": "UserReminder",
                    }
                },
                "token": fcmMessage.token.toString()
            }
        }));
        request.end();
    });
};
