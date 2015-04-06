var express = require('express');
var router = express.Router();
var Group = require('../models/Group.js');

//GET REQUESTS
router.get('/', function(req, res){
	res.render('gamblinghome',{givenTitle:"Gambling4em",givenStyle:"../stylesheets/gamblinghome.css",
		givenScript:"../javascripts/gamblinghome.js"});
});

router.get('/group/:groupName',function(req,res){
	var groupName = req.params.groupName;
	Group.findGroupEvents(groupName, function(err, events, options){
		if (err) throw (err);
		res.render('gamblinggroupfound', {givenTitle:groupName, givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js", events:events, options:options});
	});
});

router.get('/event/:eventId',function(req,res){
	var eventId = req.params.eventId;
	Group.findEvent(eventId, function(err, eventy, options, bets){
		res.render('gamblingevent', {givenTitle:eventy.eventName, event:eventy, 
			 options:options, bets:bets, givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"});
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
	Group.addGroup(groupName, function(err,group){
		if (err) throw (err);
		res.redirect('/group/'+groupName);
	});
});

router.post('/joingroup', function(req,res){
	var groupName = req.body.groupName;
	res.redirect('/group/'+groupName);
});

router.post('/createeventpage', function(req, res){
	var groupName = req.body.groupName;
	res.render('gamblingcreateevent',{givenTitle:"Create Event", givenStyle:"../stylesheets/gamblinghome.css",
		givenScript:"../javascripts/gamblinggroup.js", groupName:groupName});
});

router.post('/createevent',function(req,res){
	var options = [];
	var groupName = req.body.groupName;
	var eventName= req.body.eventName;
	var eventCreator = req.body.eventCreator;
	options[0] = req.body.option1;
	options[1] = req.body.option2; //@add generality
	Group.addEvent(groupName, eventName, eventCreator, options, function(err, eventId){
		if (err) throw (err);
		res.redirect('/event/'+eventId)
	});
});

router.post('/createbetpage',function(req,res){
	var option = req.body.option;
	res.render('gamblingcreatebet', {givenTitle:req.body.option, givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"})
});

router.post('/createbet',function(req,res){
	var event= req.body.event,
		option= req.body.option,
	    betterName= req.body.betterName,
	    betterAmount= req.body.betterAmount,
	    betterAddress = req.body.betterAddress;

	Group.addBet(option, betterName, betterAmount, betterAddress, function(err){
		if (err) throw (err);
		res.redirect('/event/'+ event);
	});
});

module.exports = router;