var googleapis = require('googleapis');

var emailSender = require('./emailSender')
var googleAPIAuthorize = require('./authorization/googleAPIAuthorize');

var scripts = {
    authorize: function() {
        googleAPIAuthorize.authorize(scripts.getCalenderEvents);
    },

    getCalenderEvents: function() {
        //need to build something that gets data from json to use to check calenders.
        var cal = googleapis.calendar('v3');

        cal.events.list({
            calendarId: 'troyblank.com_1hkegmq84hbvrgr79mc2p3n2b8@group.calendar.google.com',
            maxResults: 5
        }, function(err, data) {
            emailSender.checkForSend(data);
        });
    }
}

scripts.authorize();