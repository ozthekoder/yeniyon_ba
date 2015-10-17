var Promise = require('bluebird');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var util = require('../util');
var userSchema = new Schema({
    firstName: {
        type: String,
        validate: validateStringLength
    },
    lastName: {
        type: String,
        validate: validateStringLength
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateStringLength, validateEmail]
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: 'normal'
    },
    created_at: Date,
    updated_at: Date
});

userSchema.pre('save', function (next) {
    var currentDate = new Date();
    this.updated_at = currentDate;
    this.created_at = this.created_at || currentDate;
    if (this.password) {
        this.password = util.saltAndHashPassword(this.password);
    }
    next();
})

function validateStringLength(str) {
    return str.length > 0
}

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var User = mongoose.model('User', userSchema);
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);
module.exports = User;