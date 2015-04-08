var db = require('../db');
var async = require("async");
var ObjectId = db.Schema.Types.ObjectId;

/*
var GroupSchemaOriginal = new db.Schema({
	groupName : String,
    events : [ 
		    {
				eventName: String,
				eventCreator: String,
    			completed: Boolean,
    			options:[
				   {
						optionName: String,
	    				betters: [
							     {
								  	betterName: String,
	    							betterAddress: String,
	    							betterAmount: Number
							     }
							 ],
	  					winner: Boolean
				    }
				],
    			messages: [
				      {
						   messageFrom: String,
						   messageText: String
			 	      }
				  ]
		    }
		 ]
});
var MyGroupOriginal = db.mongoose.model('GroupOriginal', GroupSchemaOriginal);
*/

//schema
var GroupSchema = new db.Schema({
	groupName: {type:String, index: {unique: true}},
	events: [{identifier:String}]
});
var MyGroup = db.mongoose.model('Group', GroupSchema);

var EventSchema = new db.Schema({
	eventName:String,
	groupName:String,
	eventPassword:String,
	eventCreator:String,
	options: [{identifier:String}],
	messages: [{identifier:String}],
	winner: String
});
var MyEvent = db.mongoose.model('Event', EventSchema);

var OptionSchema = new db.Schema({
	groupName:String,
	eventId:String,
	eventName:String,
	optionName:String,
	betters:[{identifier:String}],
});
var MyOption = db.mongoose.model('Option', OptionSchema);

var BetterSchema = new db.Schema({
	eventId:String,
	optionId:String,
	betterName:String,
	betterAddress:String,
	betterAmount:Number
});
var MyBetter = db.mongoose.model('Better', BetterSchema);

var MessageSchema = new db.Schema({
	from:String,
	content:String
});
var MyMessage = db.mongoose.model('Message', MessageSchema);


//functions
exports.addGroup = function(groupName, callback){
	var instance = new MyGroup();
	instance.groupName = groupName;
	instance.events = [];
	instance.save(function (err) {
		if (err) {
			callback(err);
		}else{
			callback(null, instance);
		}
	});
}

var optionNumber=0;
var optionsInstance = [];
exports.addEvent = function addEventFunction(groupName, eventName, eventPassword, eventCreator, options, callback){
	if (optionNumber==0){
		var eventInstance = new MyEvent();
	}

	optionsInstance[optionNumber] = new MyOption();
	optionsInstance[optionNumber].optionName = options[optionNumber];
	optionsInstance[optionNumber].eventId = eventInstance.id;
	optionsInstance[optionNumber].groupName = groupName;
	optionsInstance[optionNumber].betters = [];
	optionsInstance[optionNumber].save(function(err){
		if (err){
			console.err;
		}
		optionNumber++;
		if (optionNumber<options.length){
			addEventFunction(groupName, eventName, eventCreator, options, callback);
		}
		if (optionNumber==options.length){
			eventInstance.eventName = eventName;
			eventInstance.eventCreator = eventCreator;
			eventInstance.groupName = groupName;
			for (var i = 0; i<options.length; i++){
				eventInstance.options[i]={identifier:optionsInstance[i].id};
			}
			eventInstance.messages = [];
			eventInstance.eventPassword = eventPassword;
			eventInstance.save(function(err){
				if (err){
					console.err;
				}
				MyGroup.update({groupName: groupName}, 
					{$push: {'events': {
								   identifier: eventInstance.id,
							   } }
					}, function(err,group){
						if (err){
							console.err;
						}else{
							callback(null,eventInstance.id)
						}
				});
				
			});
		}
	});
}

exports.findGroupEvents = function(groupName, callback){
	MyGroup.findOne({groupName:groupName}, function(err,group){
		if (err){
			callback(err);
		}
		console.log(group);
		if (group.events.length==0){
			callback(null,[],[],[],[],[]);
		}
		var eventIds = [];
		for (var i=0; i<group.events.length; i++){
			eventIds.push(group.events[i].identifier.toString());
		}
		var events=[];
		var optionIds=[];
		var options=[]; //to be double array
		var eventNumber=0;
		var callReady = 0;
		for (var a=0;a<eventIds.length;a++){
			(function(a){
				MyEvent.findById(eventIds[a], function(err, eventy){
					if (err){
						callback(err);
					}
					events[a]=eventy;
					var thisEventOptIds = []
					for (var i=0; i<eventy.options.length; i++){
						thisEventOptIds.push(eventy.options[i].identifier);
						if (i==eventy.options.length-1){
							optionIds.push(thisEventOptIds);
						}
					}
					var thisEventOptions=[];
					var pushReady=0
					for (var b=0; b<thisEventOptIds.length; b++){
						(function(b){
							MyOption.findById(thisEventOptIds[b], function(err, opt){
								if (err){
									callback(err);
								}
								thisEventOptions[b]=opt;
								if (++pushReady==thisEventOptIds.length){
									options[a]=thisEventOptions;
								}
								if (++callReady==thisEventOptIds.length*eventIds.length){
									callback(null, events, options);
								}
							});
						})(b);
					}
				});
			})(a);
		}
	});
}

exports.findEvent = function(eventId, callback){
	MyEvent.findById(eventId, function(err, event){
		if (err){
			callback(err);
		}
		console.log(event);
		MyOption.find({eventId:eventId}).exec(function(err, options){
			if (err){
				callback(err);
			}
			console.log(options);
			MyBetter.find({eventId:eventId}, function(err, bets){
				if (err){
					callback(err);
				}
				console.log(bets);
				//console.log(event+'\n\n\n\n'+options+'\n\n\n\n\n'+bets);
				if (bets==null){
					callback(null, event, options, []);
				}else{
					console.log(bets);
					callback(null, event, options, bets);
				}
			});
		});
	});
}

exports.addBet = function(eventId, optionId, name, amount, address, callback){
	var betInstance = MyBetter();
	betInstance.betterName = name;
	betInstance.betterAmount = amount;
	betInstance.betterAddress = address;
	betInstance.optionId = optionId;
	betInstance.eventId = eventId;
	betInstance.save(function(err){
		if (err){
			callback(err);
		}
		MyOption.update({_id: optionId}, 
			{$push: {'betters': {
						   identifier: betInstance.id,
					   } }
			}, function(err,option){
				if (err){
					callback(err);
				}else{
					console.log('betid' + betInstance.id);
					console.log('optid' + optionId);
					callback(null);
				}
		});
	});
}

exports.checkPassword = function(eventId, eventPassword, callback){
	MyEvent.findById(eventId, function(err, event){
		if (err){
			callback(err);
		}
		if (event.eventPassword==eventPassword){
			callback(null, true);
		}else if (event.eventPassword!=eventPassword){
			callback(null, false)
		}
	});
}