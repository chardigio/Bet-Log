var db = require('../db');
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
	groupName: {type: String, index: {unique: true}},
	events: [{identifier:String}]
});
var MyGroup = db.mongoose.model('Group', GroupSchema);

var EventSchema = new db.Schema({
	eventName: String,
	eventCreator:String,
	options: [{identifier:String}],
	messages: [{identifier:String}],
	winner: String
});
var MyEvent = db.mongoose.model('Event', EventSchema);

var OptionSchema = new db.Schema({
	optionName:String,
	betters:[{identifier:String}],
});
var MyOption = db.mongoose.model('Option', OptionSchema);

var BetterSchema = new db.Schema({
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
exports.addEvent = function addEventFunction(groupName, eventName, eventCreator, options, callback){
	optionsInstance[optionNumber] = new MyOption();
	optionsInstance[optionNumber].optionName = options[optionNumber];
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
			var eventInstance = new MyEvent();
			eventInstance.eventName = eventName;
			eventInstance.eventCreator = eventCreator;
			for (var i = 0; i<options.length; i++){
				eventInstance.options[i]={identifier:optionsInstance[i].id};
			}
			eventInstance.messages = [];
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
									console.log(a,b);
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
	MyEvent.findById(eventId, function(err, eventy){
		if (err){
			callback(err);
		}
		var optionIds = eventy.options;
		var optionNumber=0;
		var totalBets = 0;
		var callReady=0;
		var options = [];
		var bets = []; //to be double array
		for (var i=0; i<optionIds.length; i++){
			MyOption.findById(optionIds[i].identifier, function(err, option){
				if (err){
					callback(err);
				}
				options[a]=option;
				totalBets+=option.betters.length;
				var optionBets = [];
				var betNumber=0;
				if (++optionNumber==optionIds.length && totalBets==0){
					bets.push(optionBets);
					console.log(eventy);
					console.log(options);
					console.log('NO BETS');
					console.log(bets);
					callback(null, eventy, options, bets);
				}
				for (var j=0; j<option.betters.length; j++){
					MyBetter.findById(option.identifier, function(err, bet){
						if (err){
							callback(err);
						}
						optionBets[b]=bet;
						if (++betNumber==option.betters.length){
							bets.push(optionBets);
						}
						if (++callReady==optionIds.length*option.betters.length){
							console.log(eventy);
							console.log(options);
							console.log(bets);
							callback(null, eventy, options, bets);
						}
					});
				}
			});
		}
	});
}

exports.addBet = function(event, option, name, amount, address, callback){
	var betInstance = MyBetter();
	betInstance.betterName = name;
	betInstance.betterAmount = amount;
	betInstance.address = address;
	betInstance.save(function(err){
		if (err){
			callback(err);
		}
		MyOption.update({_id: option.id}, 
			{$push: {'betters': {
						   identifier: betInstance.id,
					   } }
			}, function(err,option){
				if (err){
					callback(err);
				}else{
					callback(null);
				}
		});
	});
}