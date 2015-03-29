var db = require('../db');
var ObjectId = db.Schema.Types.ObjectId;

//deprecated
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

exports.findGroupEvents = function(groupName, callback){
	MyGroup.findOne({groupName:groupName}, function(err,group){
		if (err){
			console.err;
			callback(err);
		}
		var eventIDArray = [];
		for (var i=0; i<group.events.length; i++){
			eventIDArray.push(group.events[i].identifier.toString());
		}
		console.log(eventIDArray.toString());
		var eventNameArray=[];
		var eventCreatorArray=[]
		var optionIDArray=[[]];
		var eventNumber=0;
		//for (var iterator=0;iterator<eventIDArray.length;iterator++){
		//	console.log(eventIDArray[iterator]);
		MyEvent.findById(eventIDArray[0], function(err, eventy){
			//if (err){
			//	console.err;
				//callback(err)
			//}
			//console.log(eventy);
			/*
			eventNameArray.push(eventy.eventName);
			eventCreatorArray.push(eventy.eventCreator);
			var thisEventOptions = []
			for (var i=0; i<eventy.options.length; i++){
				thisEventOptions.push(eventy.options[i].identifier);
			}
			optionIDArray.push(thisEventOptions);
			eventNumber++;
			console.log(eventNumber);
			if (eventNumber<eventIDArray.length){
				eventContentFind();
			}else{
				var optionNameArray=[[]];
				var optionIDMapped = [];
				for (var a=0; a<optionIDArray.length; a++){
					for (var b=0; b<optionIDArray[a].length; a++){
						optionIDMapped.push([optionIDArray[a][b],a,b])
					}
				}
				var optionNumber=0;
				function optionContentFind(){
					MyOption.findOne({_id:optionIDMapped[optionNumber]},function(err, option){
						if (err){
							callback(err);
						}else{
							optionNameArray[optionIDMapped[optionNumber][1]][optionIDMapped[optionNumber][2]]=option.optionName;
							optionNumber++;
							if (optionNumber<optionIDMapped.length){
								optionContentFind();
							}else{
								callback(null, eventIDArray, eventNameArray, eventCreatorArray, optionIDArray, optionNameArray);
							}
						}
					});
				}
			}*/
		});
		//}
	});
}

var optionNumber=0;
exports.addEvent = function addEventFunction(groupName, eventName, eventCreator, options, callback){
	var optionsInstance = [];
	for (var i=0; i<options.length; i++){
		optionsInstance[i] = new MyOption();
		optionsInstance[i].optionName = options[i];
		optionsInstance[i].betters = [];
	}
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
				eventInstance.options[i]=optionsInstance[i].id;
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
							callback(null,eventInstance)
						}
				});
				
			});
		}
	});
}

//deprecated
exports.addBet = function(groupName, eventName, betterName, betterAddress, betterAmount, teamName, callback){
	MyGroup.update({'events.eventName':eventName}/*{events: {$elemMatch: {'groupName':groupName, 'events.eventName':eventName, 'events.options.teamName':teamName}}}*/,
		{$push: {events/*'events.options.betters'*/: {
			betterName: betterName,
			betterAddress: betterAddress,
			betterAmount: betterAmount
			}
		}},
		function(err,updatedDoc){
			if (err) {
				console.log('kno');
				callback(err);
			}else{
				console.log('k');
				callback(null,updatedDoc);
			}
		});
}
