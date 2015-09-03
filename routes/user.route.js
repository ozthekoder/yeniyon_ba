'use strict'
var User = require('../models/user.model');
var util = require('../util');
var jwt    = require('jsonwebtoken');
module.exports = function(app){

  app.post('/users/authenticate', function(req, res){
    var auth = req.body;
    auth.password = util.saltAndHashPassword(auth.password);
    User.findOneAsync(auth)
    .then(function(user){
      if(user){
        var token = jwt.sign(user, app.get('secret'), {
          expiresInMinutes: 15 // expires in 24 hours
        });
        delete user.password;
        res.status(200).json({
          user: user,
          token: token
        });
      } else {
        res
        .status(404)
        .json({name: "ObjectNotFoundError", message: "The user with given e-amil and password was not found on the system."});
      }

    })
    .catch(function(err){
      res.status(500).json({ name: err.name, message: err.message });
    });

  });

  app.get('/users', authenticate, function(req, res){
    User.findAsync()
    .then(function(users){
      if(users){
        res.status(200).json(users);
      } else {
        res.status(404).json({ name: "ObjectNotFoundError", message: 'No users found been found'});
      }

    })
    .catch(function(err){
      console.log(err.message);
      res.status(500).json({ name : err.name, message: err.message});
    });
  });
  app.get('/users/:id', authenticate, function(req, res){
    User.findOneAsync({ _id: req.params.id})
    .then(function(user){
      if(user){
        res.status(200).json(user);
      } else {
        res.status(404).json({ name: "ObjectNotFoundError", message: 'No user found been found with the id ' + req.params.id });
      }
    })
    .catch(function(err){
      console.log(err.message);
      res.status(500).json({ name : err.name, message: err.message})
    });
  });
  app.post('/users', function(req, res){
    var user = new User(req.body);
    user = user.saveAsync()
    .then(function(user){
      res.status(200).json(user);
    })
    .catch(function(err){
      res.status(500).json({ name: err.name, message: err.message });
    });

  });

  function authenticate(req, res, next){
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, app.get('secret'), function(err, decoded) {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
          name: "AuthenticationError",
          message: 'No token provided.'
      });

    }
  }
};



/*
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NWU3ZDY2N2MzODU2N2NhMjkwZmYzMDMiLCJjcmVhdGVkX2F0IjoiMjAxNS0wOS0wM1QwNToxMTowMy4xNzFaIiwidXBkYXRlZF9hdCI6IjIwMTUtMDktMDNUMDU6MTE6MDMuMTcxWiIsImVtYWlsIjoib3NtYW5AbWFpbC5jb20iLCJwYXNzd29yZCI6IjhmYWQxNDQ3NTczNDBmZDZiMDJiOThmMmJjYTQ5NjNmNDM5YTA3NzcwMTYwZGY3M2ZiZDc4ZjkyOGY2MWM2MDEiLCJmaXJzdE5hbWUiOiJPc21hbiIsImxhc3ROYW1lIjoiT3pkZW1pciIsIl9fdiI6MCwiYWNjb3VudFR5cGUiOiJub3JtYWwifQ.elCa0oub7yF2oE8SBwOZ8ENAMzauXaUXpwy1nEurFVQ
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NWU3ZGZhYzYyMDg2NzA2MmU4MmUzYzQiLCJjcmVhdGVkX2F0IjoiMjAxNS0wOS0wM1QwNTo1MDozNi44MjFaIiwidXBkYXRlZF9hdCI6IjIwMTUtMDktMDNUMDU6NTA6MzYuODIxWiIsImVtYWlsIjoibnVtYW5AaG90bWFpbC5jb20iLCJwYXNzd29yZCI6ImRjZWI3ZmM3OTk1MjZkODE2NDVlNTcyOWIyNDBjOTdiYWZlN2ZkOTA1NzQ4M2JlYmE1M2ZjZTRiM2UzZDk5ZWEiLCJmaXJzdE5hbWUiOiJOdW1hbiIsImxhc3ROYW1lIjoiT3pkZW1pciIsIl9fdiI6MCwiYWNjb3VudFR5cGUiOiJub3JtYWwifQ.eS-LZNxnu-d9Hf1OHh3xUjKb1Cf_VwO1VXy61yEEJFM
*/
