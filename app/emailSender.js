var btoa = require('btoa');
var googleapis = require('googleapis');
var nodemailer = require('nodemailer');

var config = require('../config.json')
var prettyDate = require('./util/prettyDate');

//all checks are based on granularity a once a day run.
var emailSender = {

	IS_DESCRIPTION_ONLY: '::onlyDescription::',

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
			if (node.start != undefined && emailSender.dateIsInRange(new Date(node.start.dateTime).getTime(), list.reminderDelayInDays)) {
				emailSender.sendReminder(list, node);
			} else {
				console.log('No dates in range: ' + list.subject);
			}
		}
	},

	sendReminder: function(list, node) {
		var isDescriptionOnly = emailSender.isDescriptionOnly(node);

		var startTime = prettyDate.beautify(new Date(node.start.dateTime));
		var body = node.summary;
		var body_plain = node.summary;

		if (!isDescriptionOnly) {
			body += ' at ' + startTime.html + '.';
			body_plain += ' at ' + startTime.plain + '.';

			if (node.location) {
				body += '<br/>Location: ' + node.location
				body_plain += '\r\nLocation:' + node.location;
			}
		}

		if (node.description) {
			body += '<br/><br/>' + node.description.replace(emailSender.IS_DESCRIPTION_ONLY, '');
			body_plain += '\r\n\r\n' + node.description.replace(emailSender.IS_DESCRIPTION_ONLY, '');
		}

		if (!isDescriptionOnly) {
			body += '<br/><br/>' + list.footerText;
			body_plain += '\r\n\r\n' + list.footerText;
		}

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

	isDescriptionOnly: function(node) {
		if (node.description) {
			if (node.description.indexOf(emailSender.IS_DESCRIPTION_ONLY) >= 0) {
				return true;
			}
		}
		return false;
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