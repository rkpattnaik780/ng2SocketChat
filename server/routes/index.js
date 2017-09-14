var express = require('express');
var app = express();
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Received a Get Request...");
  res.end();
});

module.exports = router;
