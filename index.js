'use strict'
var config = require('./config');
var express = require('express');
var bodyParser = require('body-parser')
var glob = require('glob');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var _ = require('lodash');

app.set('secret', config.secret);
app.use(morgan('dev'));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

glob("routes/**/*.js", function (er, files) {
  _.each(files, function(item){
    item = './' + item;
    require(item)(app);
  })
})
// mongoose.connect('mongodb://localhost/playground');
mongoose.connect(config.mongoURI.local);
app.listen(3000, function(){
  console.log('Server started on port 3000');
})
