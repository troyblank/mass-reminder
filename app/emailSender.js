var googleapis = require('googleapis');
var prettyDate = require('./util/prettyDate');

//all checks are based on granularity a once a day run.
var emailSender = {

    //probably should make this dynamic
    REMIND_DELAY_IN_DAYS: 6,

    checkForSend: function(list, calender) {
        for (var i = 0; i < calender.items.length; i++) {
            var node = calender.items[i];
            if (emailSender.dateIsInRange(new Date(node.start.dateTime).getTime())) {
                //emailSender.getEventAndSend(list, node.id);
                emailSender.sendReminder(list, node);
            }
        }
    },

    sendReminder: function(list, node) {
        console.log(node)
        var startTime = prettyDate.beautify(new Date(node.start.dateTime));;

        var subject = list.subject;
        var body = node.summary + ' at ' + startTime;
        var emails = list.emails;

        console.log(body);
    },

    dateIsInRange: function(eventTime) {
        var reminderRangeStart = new Date();
        var reminderRangeEnd = new Date();
        reminderRangeStart.setDate(reminderRangeStart.getDate() + emailSender.REMIND_DELAY_IN_DAYS);
        reminderRangeEnd.setDate(reminderRangeStart.getDate() + 1);

        if (eventTime > reminderRangeStart.getTime() && eventTime < reminderRangeEnd.getTime()) {
            return true;
        } else {
            return false;
        }
    },

    // getEventAndSend: function(list, eventID) {
    //     //console.log(calID + ' : ' + eventID)
    //     var cal = googleapis.calendar('v3');

    //     cal.events.get({
    //         'calendarId': list.calendarId,
    //         'eventId': eventID
    //     }, function(err, data) {
    //         if (err == null) {
    //             console.log(data);
    //         } else {
    //             console.log(err)
    //         }
    //     });
    // },
}

module.exports = emailSender;