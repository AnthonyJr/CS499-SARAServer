//This file does all the work for sending the email out to the authorities
//Required files gmailappinfo.txt, a file with username and password for the SARA Account
//emailInfo.txt, a file with all of the authority emails we will be contacting.

'use strict';
const nodemailer = require('nodemailer');

//NOTES:
/*
	To add more emails simply add three new entries in the emailInfo.txt file.
	This will then use logic below to associate which emails go to which locations.
	There may be a better way of doing this down the road but I think this is a very easy way
	To allow for quick expansion of app. Add logic below for another location and add emails to text file
	Give user another option in the front end and youre done.
 */
var fs = require('fs');
var gmailAppInfo = fs.readFileSync('gmailappinfo.txt', 'utf8');
gmailAppInfo = gmailAppInfo.split('\n');

//Sets up email addresses for emailing authorities, emails are in files to avoid data leakage
//And most importantly adds the ability to add more emails based on location.
var emailAddresses = [];
var temp = fs.readFileSync('emailInfo.txt', 'utf8');
temp = temp.split('\n');
temp.forEach(function(emailAddress){
	if(emailAddress != "")
	{
		emailAddresses.push(emailAddress);
	}
})

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: gmailAppInfo[0].toString(),
		pass: gmailAppInfo[1].toString()
	}
});

// setup email data with unicode symbols
// The To will be switched off my email when its time for production...
// Read from file for privacy of email
// Set to default values of Lexington...
let policeMailOptions = {
	from: '"SARA App Alerts" <SARAAppAlerts@gmail.com>', // sender address
	to: emailAddresses[0], // list of receivers
	subject: 'SARA Report Generated', // Subject line
	text: 'Hello world ?', // plain text body
	html: '<b>Hello world ?</b>' // html body
};

let womensShelterMailOptions = {
	from: '"SARA App Alerts" <SARAAppAlerts@gmail.com>', // sender address
	to: emailAddresses[1], // list of receivers
	subject: 'SARA Report Generated', // Subject line
	text: 'Hello world ?', // plain text body
	html: '<b>Hello world ?</b>' // html body
};

let hospitalMailOptions = {
	from: '"SARA App Alerts" <SARAAppAlerts@gmail.com>', // sender address
	to: emailAddresses[2], // list of receivers
	subject: 'SARA Report Generated', // Subject line
	text: 'Hello world ?', // plain text body
	html: '<b>Hello world ?</b>' // html body
};

let mailOptions = {
	from: '"SARA App Alerts" <SARAAppAlerts@gmail.com>', // sender address
	to: '', // list of receivers
	subject: 'SARA Report Generated', // Subject line
	text: 'Hello world ?', // plain text body
	html: '<b>Hello world ?</b>' // html body
};

var mailArr = [policeMailOptions, hospitalMailOptions, womensShelterMailOptions];

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
		//Set up mail for all three objects
		mailArr.forEach(function(mailOption){
			mailOption.text = ""
			mailOption.html = "<ul>"
		})

		//Put the firstname and lastname on each object
		if(userData.firstname != undefined && userData.lastname != undefined)
		{
			mailArr.forEach(function(mailOption){
				mailOption.text += "Name: " + userData.firstname + " " + userData.lastname + "\n";
				mailOption.html += "<li>Name: " + userData.firstname + " " + userData.lastname;
			})
		}
		//Put location on each object, also decides the email receiver
		if(userData.location != undefined)
		{
			if(userData.location == "Lexington")
			{
				for(var i = 0; i < mailArr.length; i++)
				{
					mailArr[i].to = emailAddresses[i]
				}
			}

			mailArr.forEach(function(mailOption){
				mailOption.text += "Location: " + userData.location +"\n";
				mailOption.html += "<li>Location: " + userData.location;
			});

		}
		//Put date if it exists
		if(userData.date != undefined)
		{
			mailArr.forEach(function(mailOption){
				mailOption.text += "Date of incident: " + userData.date +"\n";
				mailOption.html += "<li>Date of incident: " + userData.date;
			});

		}
		//Put email if it exists
		if(userData.email != undefined)
		{
			mailArr.forEach(function(mailOption){
				mailOption.text += "Email: " + userData.email + "\n";
				mailOption.html += "<li>Email: " + userData.email;
			});

		}
		//Put phone if it exists
		if(userData.phone != undefined)
		{
			mailArr.forEach(function(mailOption){
				mailOption.text += "Phone #: " + userData.phone + "\n";
				mailOption.html += "<li>Phone #: " + userData.phone;
			});

		}
		//Check for evidence or press charges to exist, if they exist check if they are true.
		//Add to the email if they are true and send it out
		if((userData.toggleEvidence != undefined) || (user.toggleCharged != undefined))
		{
			if(userData.toggleEvidence == true || userData.toggleCharged == true)
			{
				if(userData.toggleCharged == true)
				{
					mailArr[0].text += "Press Charges: " + userData.toggleCharged + "\n";
					mailArr[0].html += "<li>Press Charges: " + userData.toggleCharged;
				}
				if(userData.toggleEvidence == true)
				{
					mailArr[0].text += "Collect Evidence: " + userData.toggleEvidence + "\n";
					mailArr[0].html += "<li>Collect Evidence: " + userData.toggleEvidence;
				}
				mailArr[0].html += "</ul>"

				transporter.sendMail(mailArr[0], (error, info) => {
				if (error) {
					callback(error);
				}
				console.log('Police Message %s sent: %s', info.messageId, info.response);
				callback(null);
				})
			}
		}
		//Check if medical is true and if it is send email
		if(userData.toggleMedical != undefined)
		{
			if(userData.toggleMedical == true)
			{
				mailArr[1].text += "Requires Medical Attention: " + userData.toggleMedical + "\n";
				mailArr[1].html += "<li>Requires Medical Attention: " + userData.toggleMedical + "</ul>";

				transporter.sendMail(mailArr[1], (error, info) => {
				if (error) {
					callback(error);
				}
				console.log('Medical Message %s sent: %s', info.messageId, info.response);
				callback(null);
				})
			}
		}
		//Check if relocation is true and if it is send email
		if(userData.toggleRelocation != undefined)
		{
			if(userData.toggleRelocation == true)
			{
				mailArr[2].text += "Needs to be relocated: " + userData.toggleRelocation + "\n";
				mailArr[2].html += "<li>Needs to be relocated: " + userData.toggleRelocation + "</ul>";

				transporter.sendMail(mailArr[2], (error, info) => {
				if (error) {
					callback(error);
				}
				console.log('Relocation Message %s sent: %s', info.messageId, info.response);
				callback(null);
				})
			}
		}

		//If theyre all false send back empty callback....
		if(userData.toggleCharged == false && userData.toggleEvidence == false 
		&& userData.toggleMedical == false && userData.toggleRelocation == false)
		{
			console.log("No email to send out");
			callback(null);
		}

	}
};