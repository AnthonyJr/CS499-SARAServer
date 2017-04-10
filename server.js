var express = require('express');
var mailer = require('./mailer');
var app = express();
var BodyParser = require('body-parser');
var cors = require('cors'); 
var logger = require('morgan');




app.use(require('body-parser').json({ extended: false }));
app.use(BodyParser.json()); 
app.use(logger('dev')); 
app.use(cors());


app.post('/SARAEmail', function (req, res) {
	console.log(req.body); 
	
	res.send(req.body); // send the body back as a response
	//res.sendStatus(200);
	
})

app.get('/Anthony', function(req, res){

	res.send("Hello Anthony!")
})

//Start Listening on port 3030
app.listen(3030, function () {
	console.log('Listening on port 3030!');
})