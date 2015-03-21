/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fs = require('fs')
//  , mongoose = require('mongoose')
//  , db = mongoose.connect('mongodb://localhost/mailinglist')
  , MailingList = require('./models/MailingList.js')
  , sendgrid = require('sendgrid')('cd17822', 'Chuck17822');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', function(req,res){
        fs.readFile('./views/vavoom.html', function(error, content) {
                if (error) {
                        res.writeHead(500);
                        res.end();
                }
                else {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf-8');
                }
        });
});

app.post('/connect', function(req, res){
	var email = req.body.email; 
	var eObject = new sendgrid.Email();
	MailingList.addUser(email, function(err, user) {
		if (err) throw err;
		res.redirect('/');
	});
	eObject.addTo(email);
	eObject.setFrom('cdigiov1@binghamton.edu');
	eObject.setSubject('Vavoom');
	eObject.setHtml('Thakns for Joining the Mailing List!');
	sendgrid.send(eObject);
	res.redirect('/');
});

//app.get('/mass', function(req, res){
//	db.findUser('mailinglists','{email: {$exists:true}}', 100, console.log('hello'));
//});
		/*
		function(err,docs){
		for (var i=0; i< docs.length; i++){
			eObject.addTo(docs[i].email);
			eObject.setFrom('cdigiov1@binghamton.edu');
			eObject.setSubject('First Test');
			eObject.setHtml('awefjio;');
			sendgrid.send(eObject);
		}
	});
});*/

app.get('/gamblinghome', function(req,res){
	res.render('gamblinghome',{givenTitle:"Gambling4em",givenStyle:"/stylesheets/gamblinghome.css",givenScript:"/javascripts/gamblinghome.js"});
});

app.get('/gamblinggroup', function(req,res){
	res.render('gamblinggroup',{givenTitle:"Gambling4em Group",givenStyle:"/stylesheets/gamblinggroup.css",givenScript:"/javascripts/gamblinggroup.js"});
});

app.post('/creategroup', function(req, res){
	var groupName = req.body.groupname;
	Group.addGroup(groupName, function(err, group){
		if (err) throw (err);
		res.redirect("'/'"+groupName+"''");
	});
});

app.get('/gallery', function(req, res){
	res.render('gallery',{givenTitle:"Vavoom Gallery", givenScript:"/javascripts/gallery.js"});
});

app.listen(8000, function(){
	console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
