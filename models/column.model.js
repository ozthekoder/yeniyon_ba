var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('../util');
var columnSchema = new Schema({
	title: {
		type: String
	},
	content: {
		type: String
	},
	writer: {
		type: String
	},
	createdAt: Date,
	updatedAt: Date,
	viewCount: {
		type: Number
	}
});

columnSchema.pre('save', function (next) {
	var currentDate = new Date();
	this.updated_at = currentDate;
	this.created_at = this.created_at || currentDate;
	next();
})

var Column = mongoose.model('Column', columnSchema);
Promise.promisifyAll(Column);
Promise.promisifyAll(Column.prototype);
module.exports = Column;
