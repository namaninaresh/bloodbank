
const router = require('express').Router();
//var sql = require('../models/db');
const   homeController = require('../controllers/homeController');

// var data ="";
// sql.query("SELECT * FROM users", function(err,rows,fields){
//   if(err) throw err;

//   data = rows;

// })


router.use('/',homeController);

module.exports = router;
