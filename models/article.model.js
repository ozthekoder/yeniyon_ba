var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('../util');
var articleSchema = new Schema({
	title: {
		type: String
	},
	content: {
		type: String
	},
	source: {
		type: String
	},
	addedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	createdAt: Date,
	updatedAt: Date,
	viewCount: {
		type: Number
	}
});

articleSchema.pre('save', function (next) {
	var currentDate = new Date();
	this.updated_at = currentDate;
	this.created_at = this.created_at || currentDate;
	next();
})

var Article = mongoose.model('Article', articleSchema);
Promise.promisifyAll(Article);
Promise.promisifyAll(Article.prototype);
module.exports = Article;
