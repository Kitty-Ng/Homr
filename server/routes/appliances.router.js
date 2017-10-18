var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');
var bodyParser = require('body-parser');

router.get('/', function (req, res) {
  console.log('inside /appliances GET route');
  // check if logged in
  if (req.isAuthenticated()) {
    console.log('logged in user for appliances');
    pool.connect(function (conErr, client, done) {
      if (conErr) {
        res.sendStatus(500);
      } else {
        client.query('SELECT * FROM appliances', function (queryErr, resultObj) {
          done();
          if (queryErr) {
            res.sendStatus(500);
          } else {
            res.send(resultObj.rows);
          }
        });
      }
    })
  } else {
    console.log('not logged in');
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

router.post('/', function (req, res) {
  var userId = req.user.id;
  var myTools = req.body.myAppliances;
  console.log('inside the server router myTools', myTools);

  pool.connect(function (conErr, client, done) {
    if (conErr) {
      console.log('conErr');
      res.sendStatus(500);
    } else {
      client.query('INSERT INTO users_appliances(user_id, appliance_id) VALUES($1, $2);', [userId, myTools.appliance_id],function (queryErr, resultObj) {
        done();
        if (queryErr) {
          res.sendStatus(500);
        } else {
          res.send(resultObj.rows);
        }
      });
    }
  })
});


module.exports = router;
