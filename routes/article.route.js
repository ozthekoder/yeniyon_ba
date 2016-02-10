const Article = require('../models/article.model');
const util = require('../util');
const jwt = require('jsonwebtoken');
const faker = require('faker');

module.exports = function (app) {

  app.get('/articles', authenticate, function (req, res) {
    Article.findAsync()
    .then(function (users) {
      if (users) {
        res.status(200).json(users);
      } else {
        res.status(404).json({
          name: "ObjectNotFoundError",
          message: 'No users found been found'
        });
      }

    })
    .catch(function (err) {
      console.log(err.message);
      res.status(500).json({
        name: err.name,
        message: err.message
      });
    });
  });

  app.get('/articles/:id', authenticate, function (req, res) {
    Article.findOneAsync({
      _id: req.params.id
    })
    .then(function (article) {
      if (article) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          name: "ObjectNotFoundError",
          message: 'No article found been found with the id ' + req.params.id
        });
      }
    })
    .catch(function (err) {
      console.log(err.message);
      res.status(500).json({
        name: err.name,
        message: err.message
      })
    });
  });

  app.post('/articles', function (req, res) {
    var article = new Article(req.body);
    article = article.saveAsync()
    .then(function (article) {
      res.status(200).json(article);
    })
    .catch(function (err) {
      res.status(500).json({
        name: err.name,
        message: err.message
      });
    });

  });

  app.post('/articles/generate-random/:count', function (req, res) {
  });

  function parseBearerToken(req) {
    var auth;
    if (!req.headers || !(auth = req.headers.authorization)) {
      return null;
    }
    var parts = auth.split(' ');
    if (2 > parts.length) return null;
    var schema = parts.shift().toLowerCase();
    var token = parts.join(' ');
    if ('bearer' != schema) return null;
    return token;
  }

  function authenticate(req, res, next) {
    var token = parseBearerToken(req);
    console.log(req.headers);
    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, app.get('secret'), function (err, decoded) {
        if (err) {
          return res.status(403).json({
            success: false,
            message: 'Failed to authenticate token.'
          });
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
