var express = require('express');
var router = express.Router();
var path = require('path');

// /* GET home page. */
router.get('/', function(req, res, next) {
  const pubPath = path.join(__dirname, '..', '..', 'frontend', 'public');
  res.sendFile('index.html');
});

module.exports = router;
