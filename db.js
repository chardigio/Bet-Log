var mongoose = require('mongoose'),
	uriUtil = require('mongodb-uri');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
var mongodbUri = 'mongodb://localhost/GamblingGroups';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri)
//exports.findUser = function(name, query, limit, callback){
//	db.collection(name).find(query).sort({_id: -1}).limit(limit).toArray(callback);
//}
