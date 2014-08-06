var fs = require('fs');
var googleapis = require('googleapis');
var mkdirp = require('mkdirp');

var config = require("../../config");

//THIS ALLOWS SERVER TO SERVER AUTHENTICATION VIA A JWT GOOGLE API KEY
var googleAPIAuthorize = {

    EXPIRE_HOURS: 1,

    jwt: new googleapis.auth.JWT(
        config.api.email,
        config.api.keyFile,
        config.api.key,
        config.api.scopes
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

            //the expiry_date returned by Google seems wrong, so here we are setting our own.
            var expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + googleAPIAuthorize.EXPIRE_HOURS);
            googleAPIAuthorize.storeToken({
                'access_token': googleAPIAuthorize.jwt.credentials.access_token,
                'refresh_token': googleAPIAuthorize.jwt.credentials.refresh_token,
                'expiry_date': expiryDate.getTime()
            });

            googleAPIAuthorize.setCredentials(googleAPIAuthorize.jwt.credentials.access_token, googleAPIAuthorize.jwt.credentials.refresh_token);
            callBack();
        });
    }
}



module.exports = googleAPIAuthorize;