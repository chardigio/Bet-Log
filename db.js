var mongoose = require('mongoose'),
	uriUtil = require('mongodb-uri'),
	Schema = mongoose.Schema,
	mongodbUri = 'mongodb://localhost/GamblingCollections',
	mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri)

module.exports.mongoose = mongoose;
module.exports.Schema = Schema;