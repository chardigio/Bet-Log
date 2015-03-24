var db = require('../db');
var GroupSchema = new db.Schema({
	groupName : String,
    	events : [ 
		    {
				eventName: String,
    			options:[
				   {
					team: String,
    					betters: [
						     {
							  	betterName: String,
    							betterAddress: String,
    							betterAmount: String
						     }
						 ],
  					winner: Boolean
				    }
				],
				eventCreator: String,
    			completed: Boolean,
    			messages: [
				      {
					   messageFrom: String,
					   messageText: String
			 	      }
				  ]
		    }
		 ]
});

var MyGroup = db.mongoose.model('Group', GroupSchema);

exports.addGroup = function(groupName, callback){
	var instance = new MyGroup();
	instance.groupName = groupName;
	instance.save(function (err) {
		if (err) {
			callback(err);
		}else{
			callback(null, instance);
		}
	});
}

exports.addEvent = function(givenGroupName, eventName, eventCreator, options, callback){
	MyGroup.find({'groupName':givenGroupName}, function(err, group){
		if (err) return handleError(err);
		if (group){
			MyGroup.update({groupName: givenGroupName}, {$push: {
				events: {
						eventName: eventName,
						//'options.team' : {$each: [options[0],options[1]]},
						eventCreator: eventCreator,
						completed: false
					} }
			}, function(err,group){
				if (err) {
					console.err;
				}else{
					callback(null, group);
				}
			});
		}
	})
}

exports.addBet = function(groupName, eventName, better, amount, email, team, callback){
	MyGroup.find({'groupName' : groupName}, function(err, group){
		if (err) return handleError(err);
		if (group){
			/*var groupString = JSON.stringify(group);
			console.log(groupString);
			console.log(group);
			if (group.indexOf(eventName)) {
					var insertedString = group.slice(team);
			}
			var insertedString = group.slice(0,group.indexOf(eventName)+18);*/
		}
	});
}


