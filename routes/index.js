var express = require('express');
var router = express.Router();
var Group = require('../models/Group.js');

//GET REQUESTS
router.get('/', function(req, res){
	res.render('gamblinghome',{givenTitle:"Gambling4em",givenStyle:"../stylesheets/gamblinghome.css",
		givenScript:"../javascripts/gamblinghome.js"});
});

//for testing purposes
router.get('/createbet', function(req,res){
	res.redirect('/');
});

//for testing purposes
router.get('/joingroup',function(req,res){
	Group.findGroupEvents('chch', function(err, eventIDArray, eventNameArray, eventCreatorArray, optionIDArray, optionNameArray){
		console.log(eventIDArray);
		console.log(eventNameArray);
		console.log(eventCreatorArray);
		console.log(optionIDArray);
		console.log(optionNameArray);
		console.log("woo!");
	});
});

//POST REQUESTS
router.post('/creategrouppage', function(req,res){
	res.render('gamblingcreategroup', {givenTitle:"Gambling4em", givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"})
});

router.post('/joingrouppage', function(req,res){
	res.render('gamblingjoingroup', {givenTitle:"Gambling4em", givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"})
});

router.post('/creategroup', function(req, res){
	var groupName = req.body.groupName;
	Group.addGroup(groupName, function(err, group){
		if (err) throw (err);
		res.render('gamblinggroup',{givenTitle:groupName, givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"});
	});
});

router.post('/joingroup', function(req,res){
	var groupName = req.body.groupName;
	Group.findGroupEvents(groupName, function(err, eventIDArray, eventNameArray, eventCreatorArray, optionIDArray, optionNameArray){
		console.log(eventIDArray);
		console.log(eventNameArray);
		console.log(eventCreatorArray);
		console.log(optionIDArray);
		console.log(optionNameArray);
		console.log("woo!");
		if (err) throw (err);
		res.render('gamblinggroupfound', {givenTitle:groupName, givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js", eventIDArray:eventIDArray, eventNameArray:eventNameArray, 
			eventCreatorArray:eventCreatorArray, optionIDArray:optionIDArray, optionNameArray:optionNameArray});
	});
});

router.post('/createeventpage', function(req, res){
	var groupName = req.body.groupName;
	res.render('gamblingcreateevent',{givenTitle:"Create Event", givenStyle:"../stylesheets/gamblinghome.css",
		givenScript:"../javascripts/gamblinggroup.js", groupName:groupName});
});

router.post('/createevent',function(req,res){
	var options = [];
	var groupName = req.body.groupName,
		eventName= req.body.eventName,
		eventCreator = req.body.eventCreator;
	options[0] = req.body.option1;
	options[1] = req.body.option2;
	Group.addEvent(groupName, eventName, eventCreator, options, function(err, group){
		if (err) throw (err);
		res.render('gamblingevent',{givenTitle:eventName, groupName:groupName, eventName:eventName, 
			eventCreator:eventCreator, opt1:options[0], opt2:options[1], givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"});
	});
});

router.post('/createbet',function(req,res){
	var groupName= req.body.groupName,
	    eventName= req.body.eventName,
	    team= req.body.team,
	    amount = req.body.amount,
		better=req.body.better,
		address=req.body.address;

	Group.addBet(groupName, eventName, better, address, amount, team, function(err, group){
		if (err) throw (err);
		res.redirect('/')
	});
});

module.exports = router;