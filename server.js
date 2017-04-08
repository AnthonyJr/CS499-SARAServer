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


	//res.send('Hello World!')
	//console.log(req.body.name);
	//res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "X-Requested-With");
	console.log(req.body); 
	var response= "Loud and clear"; 
	res.send(req.body)
	//res.sendStatus(200);
	
	//mailer.sendMail('dakota.amiot@uky.edu')
	//mailer.sendMail('atsn222@g.uky.edu')
})

app.get('/Anthony', function(req, res){

	res.send("Hello Anthony!")
})

//Start Listening on port 3030
app.listen(3030, function () {
	console.log('Listening on port 3030!');
})