var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Index Page',message:"Hellow world this is chinna Namani" });
});

module.exports = router;
