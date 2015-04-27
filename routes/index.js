var express = require('express');
var router = express.Router();
var Group = require('../models/Group.js');

//GET REQUESTS
router.get('/', function(req, res){
	res.render('gamblinghome',{givenTitle:"Bet Log",
		givenStyle:"../stylesheets/gamblinghome.css",
		givenScript:"../javascripts/gamblinghome.js"});
});

router.get('/group/:groupName',function(req,res){
	var groupName = req.params.groupName;
	Group.findGroupEvents(groupName, function(err, events, options){
		if (err) throw (err);
		res.render('gamblinggroupfound', {givenTitle:groupName, 
			givenStyle:"../stylesheets/gamblinghome.css",
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
	res.render('gamblingcreategroup', {givenTitle:"Bet Log", 
		givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"})
});

router.post('/joingrouppage', function(req,res){
	res.render('gamblingjoingroup', {givenTitle:"Bet Log", 
		givenStyle:"../stylesheets/gamblinghome.css",
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
	res.render('gamblingcreateevent',{givenTitle:"Create Event", 
		givenStyle:"../stylesheets/gamblinghome.css",
		givenScript:"../javascripts/gamblinggroup.js", groupName:groupName});
});

router.post('/createevent',function(req,res){
	var options = [];
	var groupName = req.body.groupName;
	var eventName= req.body.eventName;
	var eventCreator = req.body.eventCreator;
	var eventPassword = req.body.eventPassword;
	options[0] = req.body.option1;
	options[1] = req.body.option2; //@add generality
	console.log(options);
	Group.addEvent(groupName, eventName, eventPassword, eventCreator, options, function(err, eventId){
		if (err) throw (err);
		res.redirect('/event/'+eventId)
	});
});

router.post('/createbetpage',function(req,res){
	var optionId = req.body.optionId;
	var eventId = req.body.eventId;
	var groupName = req.body.groupName;
	var optionName = req.body.optionName;

	res.render('gamblingcreatebet', {givenTitle:'Place Bet', groupName:groupName, 
		optionId:optionId, optionName: optionName, eventId:eventId, givenStyle:"../stylesheets/gamblinghome.css",
			givenScript:"../javascripts/gamblinghome.js"})
});

router.post('/createbet',function(req,res){
	var eventId= req.body.eventId,
		optionId= req.body.optionId,
		optionName= req.body.optionName,
	    betterName= req.body.betterName,
	    betterAmount= req.body.betterAmount,
	    betterAddress = req.body.betterAddress,
	    carrier = req.body.carrier;
	var adr;
	var amt;
	if (betterAmount[0]!='$' && (betterAmount[0]=='0' || 
		 betterAmount[0]=='1' || betterAmount[0]=='2' || 
		 betterAmount[0]=='3' || betterAmount[0]=='4' || 
		 betterAmount[0]=='5' || betterAmount[0]=='6' || 
		 betterAmount[0]=='7' || betterAmount[0]=='8' || 
		 betterAmount[0]=='9')){    //so ashamed of this
		amt = '$' + betterAmount;
	}else{
		amt = betterAmount;
	}
	if (carrier=='AT&T'){
		adr = betterAddress + '@txt.att.net';
	}else if (carrier=='Sprint'){
		adr = betterAddress + '@messaging.sprintpcs.com';
	}else if (carrier=='T-Mobile'){
		adr = betterAddress + '@tmomail.net';
	}else if (carrier=='Verizon'){
		adr = betterAddress + '@vtext.com';
	}else if (carrier=='Virgin Mobile'){
		adr = betterAddress + '@vmobl.com';
	}else{
		adr = null;
	}
	Group.addBet(eventId, optionId, optionName, betterName, amt, adr, function(err){
			if (err) throw (err);
			res.redirect('/event/'+ eventId);
	});
});

router.post('/selectwinpage',function(req,res){
	var eventId= req.body.eventId,
		eventName= req.body.eventName,
		eventCreator= req.body.eventCreator,
		groupName= req.body.groupName,
		opt1id= req.body.opt1id,
		opt2id= req.body.opt2id,
		opt1name= req.body.opt1name,
		opt2name= req.body.opt2name;

	res.render('gamblingselectwinpage', {givenTitle:eventName, 
		givenStyle:"../stylesheets/gamblinghome.css", 
		givenScript:"../javascripts/gamblinggroup.js", groupName:groupName, 
		eventCreator:eventCreator, eventName:eventName, eventId:eventId, opt1id:opt1id, 
		opt2id:opt2id, opt1name:opt1name, opt2name:opt2name});
});

router.post('/eventPass',function(req,res){
	var eventId= req.body.eventId,
		eventName= req.body.eventName,
		eventCreator= req.body.eventCreator,
		groupName= req.body.groupName,
		opt1id= req.body.opt1id,
		opt2id= req.body.opt2id,
		opt1name= req.body.opt1name,
		opt2name= req.body.opt2name,
		eventPassword= req.body.eventPassword;

	Group.checkPassword(eventId, eventPassword, function(err, bool){
		if (err) throw (err);
		if (bool){
			res.render('gamblingselectwinner', {givenTitle:eventName, 
				givenStyle:"../stylesheets/gamblinghome.css", 
				givenScript:"../javascripts/gamblinggroup.js", groupName:groupName, 
				eventCreator:eventCreator, eventName:eventName, eventId:eventId, opt1id:opt1id, 
				opt2id:opt2id, opt1name:opt1name, opt2name:opt2name})
		}else{
			res.render('gamblingselectwinpage', {givenTitle:eventName, 
				givenStyle:"../stylesheets/gamblinghome.css", 
				givenScript:"../javascripts/gamblinggroup.js", groupName:groupName, 
				eventCreator:eventCreator, eventName:eventName, eventId:eventId, opt1id:opt1id, 
				opt2id:opt2id, opt1name:opt1name, opt2name:opt2name});
		}
	})

});

router.post('/selectwin', function(req,res){
	var groupName=req.body.groupName,
		eventId=req.body.eventId,
		winOptId=req.body.winOptId,
		loseOptId=req.body.loseOptId;
	Group.declareWin(eventId, winOptId, loseOptId, function(err){
		if (err) throw err;
		res.redirect('/event/'+eventId);
	});
});

module.exports = router;