var express = require('express');
var mailer = require('./mailer');
var app = express();
var BodyParser = require('body-parser');
var cors = require('cors'); 
var logger = require('morgan');
var request = require('request');

app.use(require('body-parser').json({ extended: false }));
app.use(BodyParser.json()); 
app.use(logger('dev')); 
app.use(cors());


app.post('/SARAEmail', function (req, res) {
	//console.log(req.body);
	//Callback to make sure the email actually sent successfully before returning a 200 OK Response.
	//500 Internal Server Error otherwise.
	mailer.formatSARAEmail(req.body, function(error){
		  if(error)
		  {
			  res.statusCode = 500;
			  res.send("Internal Server Error: Email Not Sent");
		  }
		  res.statusCode = 200;
          res.send("Email Successfully Sent"); // send the body back as a response
    });
	
	//This interacts with luna PHP server to add incident to database
	if(req.body.login){
		request('https://luna-app.000webhostapp.com/api/v1/logIncident.php?userHash='+req.body.username+'&location=University%20of%20Kentucky&date='+req.body.date, function (error, response, body) {
  			//console.log('error:', error); // Print the error if one occurred 
  			console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received 
  			//console.log('body:', body); // Print the HTML for the Google homepage. 
		});
	}
})

//Literally just for checking to make sure server is alive. Will be deleted before production
app.get('/Anthony', function(req, res){

	res.send("Hello Anthony!")
})

//Start Listening on port 3030
app.listen(3030, function () {
	console.log('Listening on port 3030!');
})