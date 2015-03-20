
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fs = require('fs')
  , MailingList = require('./models/MailingList.js');

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
	MailingList.addUser(email, function(err, user) {
		if (err) throw err;
		res.redirect('/');
	});
});

app.get('/gallery', function(req, res){
	res.render('gallery',{givenTitle:"Vavoom Gallery", givenScript:"/javascripts/gallery.js"});
});

app.listen(80, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
