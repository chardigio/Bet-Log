var db = require('../db');
var MailingListSchema = new db.Schema({
	email : {type: String, unique : false} //UNIQUE : TRUE IS THE REASON ITS CRASHING UPON DUPES!
})

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
