var db = require('../db');
var MailingListSchema = new db.Schema({
	email : {type: String, unique : true}
})

var MyUser = db.mongoose.model('MailingList', MailingListSchema);

module.exports.addUser = addUser;

function addUser(email, callback){
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
