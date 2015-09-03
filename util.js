'use strict'
var config = require('./config');
var crypto = require('crypto');
module.exports = {
  saltAndHashPassword: function(password) {
    password += config.salt;
    password = crypto.createHash('sha256').update(password).digest('hex');
    return password;
  }
}
