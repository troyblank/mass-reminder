var fs = require('fs');
var googleapis = require('googleapis');

var config = require('../config.json')
var emailSender = require('./emailSender');
var googleAPIAuthorize = require('./authorization/googleAPIAuthorize');

var scripts = {

    lists: null,
    MAX_EVENT_RETURNS: 3,

    authorize: function() {
        googleAPIAuthorize.authorize(scripts.getEmailLists);
    },

    getEmailLists: function() {
        scripts.lists = config.lists;
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
            'calendarId': list.calendarId,
            'maxResults': scripts.MAX_EVENT_RETURNS
        }, function(err, data) {
            if (err == null) {
                emailSender.checkForSend(list, data);
            } else {
                console.log(err)
            }
        });
    }
}

scripts.authorize();