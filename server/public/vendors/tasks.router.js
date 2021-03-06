var express = require('express');
var router = express.Router();
var pool = require('../modules/pool.js');
var bodyParser = require('body-parser');

//For each selected appliance, GET the associated tasks so user can enter firstcompleteddate
router.get('/', function (req, res) {
  var userId = req.user.id;
  // check if logged in
  if (req.isAuthenticated()) {
    pool.connect(function (conErr, client, done) {
      if (conErr) {
        res.sendStatus(500);
      } else {
        client.query('SELECT * FROM users_appliances INNER JOIN tasks ON tasks.appliance_id = users_appliances.appliance_id WHERE user_id = $1', [userId], function (queryErr, resultObj) {
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
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }
});

router.put('/', function (req, res) {
  var mytaskid = req.body.mytask_id;

  // check if logged in
  if (req.isAuthenticated()) {
    pool.connect(function (conErr, client, done) {
      if (conErr) {
        res.sendStatus(500);
 
      } else {
        client.query("UPDATE mytasks SET taskcompleted= 'TRUE', task_completion_date= CURRENT_TIMESTAMP WHERE mytask_id = $1", [mytaskid], function (queryErr, resultObj) {
          done();
          if (queryErr) {
            res.sendStatus(500);
          } else {
            res.sendStatus(200)
          }
        });
      }
    })
  } else {
    // should probably be res.sendStatus(403) and handled client-side, esp if this is an AJAX request (which is likely with AngularJS)
    res.send(false);
  }

});

module.exports = router;
