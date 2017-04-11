'use strict';
const nodemailer = require('nodemailer');

/* 
*  Get the app info here because I don't want this to be on GitHub
*  Ask Dave for this information and don't upload the file to GitHub...
*  I will deny your pull request if you have this info in your directory.
*/
var fs = require('fs');
var gmailAppInfo = fs.readFileSync('gmailappinfo.txt', 'utf8');
gmailAppInfo = gmailAppInfo.split('\n');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailAppInfo[0].toString(),
		pass: gmailAppInfo[1].toString()
	}
});

// setup email data with unicode symbols
let mailOptions = {
	from: '"SARA App Alerts" <SARAAppAlerts@gmail.com>', // sender address
	to: '', // list of receivers
	subject: 'SARA Report Generated', // Subject line
	text: 'Hello world ?', // plain text body
	html: '<b>Hello world ?</b>' // html body
};


module.exports = {
	// send mail with defined transport object
	sendMail: function(emailAddress){
		mailOptions.to = emailAddress;
		transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message %s sent: %s', info.messageId, info.response);
	})},
	tester: function(emailAddress){
		mailOptions.to = emailAddress;
		console.log(mailOptions.to);
	},
	formatSARAEmail: function(userData, callback){
		mailOptions.text = ""
		mailOptions.html = "<ul>"
		if(userData.firstname != undefined && userData.lastname != undefined)
		{
			mailOptions.text += "Name: " + userData.firstname + " " + userData.lastname + "\n";
			mailOptions.html += "<li>Name: " + userData.firstname + " " + userData.lastname;

		}
		if(userData.location != undefined)
		{
			mailOptions.text += "Location: " + userData.location +"\n";
			mailOptions.html += "<li>Location: " + userData.location;
		}
		if(userData.date != undefined)
		{
			mailOptions.text += "Date of incident: " + userData.date +"\n";
			mailOptions.html += "<li>Date of incident: " + userData.date;
		}
		if(userData.email != undefined)
		{
			mailOptions.text += "Email: " + userData.email + "\n";
			mailOptions.html += "<li>Email: " + userData.email;
		}
		if(userData.phone != undefined)
		{
			mailOptions.text += "Phone #: " + userData.phone + "\n";
			mailOptions.html += "<li>Phone #: " + userData.phone;
		}
		if(userData.toggleCharged != undefined)
		{
			mailOptions.text += "Press Charges: " + userData.toggleCharged + "\n";
			mailOptions.html += "<li>Press Charges: " + userData.toggleCharged;
		}
		if(userData.toggleEvidence != undefined)
		{
			mailOptions.text += "Collect Evidence: " + userData.toggleEvidence + "\n";
			mailOptions.html += "<li>Collect Evidence: " + userData.toggleEvidence + "\n";
		}
		if(userData.toggleMedical != undefined)
		{
			mailOptions.text += "Requires Medical Attention: " + userData.toggleMedical + "\n";
			mailOptions.html += "<li>Requires Medical Attention: " + userData.toggleMedical;
		}
		if(userData.toggleRelocation != undefined)
		{
			mailOptions.text += "Needs to be relocated: " + userData.toggleRelocation + "\n";
			mailOptions.html += "<li>Needs to be relocated: " + userData.toggleRelocation;
		}
		//mailOptions.html += mailOptions.text
		mailOptions.html += "</ul>"
		mailOptions.to = "deca222@g.uky.edu"
		transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			callback(error);
		}
			console.log('Message %s sent: %s', info.messageId, info.response);
			callback(null);
		})
	}
};