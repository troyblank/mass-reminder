var btoa = require('btoa');
var googleapis = require('googleapis');
var nodemailer = require('nodemailer');

var config = require('../config.json')
var prettyDate = require('./util/prettyDate');

//all checks are based on granularity a once a day run.
var emailSender = {

	transporter: nodemailer.createTransport({
		service: 'Gmail',
		auth: {
			user: config.emailSender.user,
			pass: config.emailSender.pass
		}
	}),

	checkForSend: function(list, calender) {
		for (var i = 0; i < calender.items.length; i++) {
			var node = calender.items[i];
			if (emailSender.dateIsInRange(new Date(node.start.dateTime).getTime(), list.reminderDelayInDays)) {
				emailSender.sendReminder(list, node);
			}
		}
	},

	sendReminder: function(list, node) {
		var startTime = prettyDate.beautify(new Date(node.start.dateTime));;
		var body = node.summary + ' at ' + startTime.html + '.';
		var body_plain = node.summary + ' at ' + startTime.plain + '.';

		if (node.location) {
			body += '<br/>Location: ' + node.location
			body_plain += '\r\nLocation:' + node.location;
		}

		if (node.description) {
			body += '<br/><br/>' + node.description;
			body_plain += '\r\n\r\n' + node.description;
		}

		body += '<br/><br/>' + list.footerText;
		body_plain += '\r\n\r\n' + list.footerText;

		var mailOptions = {
			to: list.emails.toString(),
			subject: list.subject,
			text: body_plain,
			html: body
		};

		emailSender.transporter.sendMail(mailOptions, function(error, data) {
			if (error) {
				console.log(error);
			} else {
				console.log('Message sent: ' + data.response);
			}
		});
	},

	dateIsInRange: function(eventTime, delay) {
		var reminderRangeStart = new Date();
		var reminderRangeEnd = new Date();
		reminderRangeStart.setDate(reminderRangeStart.getDate() + delay);
		reminderRangeEnd.setDate(reminderRangeStart.getDate() + 1);

		if (eventTime > reminderRangeStart.getTime() && eventTime < reminderRangeEnd.getTime()) {
			return true;
		} else {
			return false;
		}
	}
}

module.exports = emailSender;