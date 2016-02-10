const User = require('../models/user.model');
const util = require('../util');
const jwt = require('jsonwebtoken');
const faker = require('faker');

module.exports = function (app) {

  app.post('/users/authenticate', function (req, res) {
    var auth = req.body;
    auth.password = util.saltAndHashPassword(auth.password);
    User.findOneAsync(auth)
    .then(function (user) {
      if (user) {
        user = user.toJSON();
        var token = jwt.sign(user, app.get('secret'), {
          expiresIn: 900 // expires in 15 mins
        });
        delete user.password;
        res.status(200).json({
          user: user,
          token: token
        });
      } else {
        res
        .status(404)
        .json({
          name: "ObjectNotFoundError",
          message: "The user with given e-amil and password was not found on the system."
        });
      }

    })
    .catch(function (err) {
      res.status(500).json({
        name: err.name,
        message: err.message
      });
    });

  });

  app.get('/users', authenticate, function (req, res) {
    User.findAsync()
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

  app.get('/users/:id', authenticate, function (req, res) {
    User.findOneAsync({
      _id: req.params.id
    })
    .then(function (user) {
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({
          name: "ObjectNotFoundError",
          message: 'No user found been found with the id ' + req.params.id
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

  app.post('/users', function (req, res) {
    var user = new User(req.body);
    user = user.saveAsync()
    .then(function (user) {
      res.status(200).json(user);
    })
    .catch(function (err) {
      res.status(500).json({
        name: err.name,
        message: err.message
      });
    });

  });

  app.post('/users/generate-random/:count', function (req, res) {
    var count = req.params.count;
    var user;
    for(var i=0; i< count; i++) {
      var json = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        phone: faker.phone.phoneNumber(),
        dateOfBirth: faker.date.past(),
        address: {
          street: faker.address.streetAddress(),
          city: faker.address.city(),
          zip: faker.address.zipCode(),
          state: faker.address.stateAbbr()
        },
        company: {
          name: faker.company.companyName(),
          address: {
            street: faker.address.streetAddress(),
            city: faker.address.city(),
            zip: faker.address.zipCode(),
            state: faker.address.stateAbbr()
          },
          phone: faker.phone.phoneNumber()
        },
        avatar: faker.image.avatar()
      };

      user = new User(json);

      user.saveAsync()
      .then(function (user) {
        console.log('successfully saved user')
      })
      .catch(function (err) {
        console.log(err);
      });
    }



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
