var db = require('../db');
var GroupSchema = new db.Schema({
	groupName : String,
    	events : [ 
		    {
			eventName: String,
    			eventCreator: String,
    			options:[
				   {
					team: String,
    					betters: [
						     {
							  betterName: String,
    							  betterAddress: String,
    							  betterAmount: float
						     }
						 ]
  					winner: boolean
				    }
				],
    			completed:boolean
		    }
		 ]
	}
});

var MyUser = db.mongoose.model('MailingList', MailingListSchema);

exports.addUser = function(email, callback){
	var instance = new MyUser();
	instance.email = email;
	instance.save(function (err) {
		if (err) {
			callback(err);
		}else{
			callback(null, instance);
		}
	});
}