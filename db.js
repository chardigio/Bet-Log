var mongoose = require('mongoose'),
	uriUtil = require('mongodb-uri');
var Schema = mongoose.Schema;
module.exports.mongoose = mongoose;
module.exports.Schema = Schema;
var mongodbUri = 'mongodb://localhost/GamblingCollections';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
mongoose.connect(mongooseUri)
