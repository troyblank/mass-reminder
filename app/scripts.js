var fs = require('fs');
var googleapis = require('googleapis');

var emailSender = require('./emailSender')
var googleAPIAuthorize = require('./authorization/googleAPIAuthorize');

var scripts = {

    lists: null,

    authorize: function() {
        googleAPIAuthorize.authorize(scripts.getEmailLists);
    },

    getEmailLists: function() {
        scripts.lists = JSON.parse(fs.readFileSync('config.json')).lists;
        scripts.getCalenderEvents();
    },

    getCalenderEvents: function() {
        var i = scripts.lists.length - 1;
        while (i >= 0) {
            scripts.getCalenderEvent(scripts.lists[i]);
            i--;
        }
    },

    getCalenderEvent: function(list) {
        var cal = googleapis.calendar('v3');

        cal.events.list({
            calendarId: list.calendarId,
            maxResults: 5
        }, function(err, data) {
            emailSender.checkForSend(data);
        });
    }
}

scripts.authorize();