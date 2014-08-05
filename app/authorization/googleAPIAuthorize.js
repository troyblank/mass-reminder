var fs = require('fs');
var googleapis = require('googleapis');
var mkdirp = require('mkdirp');

var authData = require("./auth.config");

//THIS ALLOWS SERVER TO SERVER AUTHENTICATION VIA A JWT GOOGLE API KEY
var googleAPIAuthorize = {

    jwt: new googleapis.auth.JWT(
        authData.email,
        authData.keyFile,
        authData.key,
        authData.scopes
    ),

    tokenStorePath: '/data/',
    tokenStoreFile: 'token.json',

    authorize: function(callBack) {
        //returns an API key
        mkdirp.sync(__dirname + googleAPIAuthorize.tokenStorePath);
        googleAPIAuthorize.getToken(callBack);
    },

    getToken: function(callBack) {
        fs.readFile(googleAPIAuthorize.getTokenStorePath(), 'utf8', function(err, data) {
            if (err != null) {
                googleAPIAuthorize.fetchToken(callBack);
            } else {
                var data = JSON.parse(data);
                if (new Date() > new Date(data.expiry_date)) {
                    googleAPIAuthorize.fetchToken(callBack);
                } else {
                    googleAPIAuthorize.setCredentials(data.access_token, data.refresh_token);
                    callBack();
                }
            }
        });
    },

    storeToken: function(data) {
        fs.writeFileSync(googleAPIAuthorize.getTokenStorePath(), JSON.stringify(data));
    },

    getTokenStorePath: function() {
        return __dirname + googleAPIAuthorize.tokenStorePath + googleAPIAuthorize.tokenStoreFile;
    },

    setCredentials: function(accessToken, refreshToken) {
        googleAPIAuthorize.jwt.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken
        });

        googleapis.options({
            auth: googleAPIAuthorize.jwt
        });
    },

    fetchToken: function(callBack) {
        //if token does not exist or is expired retrieve it from Google.
        googleAPIAuthorize.jwt.authorize(function(err, data) {
            if (err) {
                console.log("Error: ", err);
                return;
            }

            googleAPIAuthorize.storeToken({
                'access_token': googleAPIAuthorize.jwt.credentials.access_token,
                'refresh_token': googleAPIAuthorize.jwt.credentials.refresh_token,
                'expiry_date': googleAPIAuthorize.jwt.credentials.expiry_date
            });

            googleAPIAuthorize.setCredentials(googleAPIAuthorize.jwt.credentials.access_token, googleAPIAuthorize.jwt.credentials.refresh_token);
            callBack();
        });
    }
}



module.exports = googleAPIAuthorize;