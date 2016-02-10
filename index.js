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

var routes = config.routes;

_.each(routes, function(route){
	require(route)(app);
});
mongoose.connect(config.mongoURI.local);
app.listen(config.port, function(){
	console.log('Server started on port ' + config.port);
});
