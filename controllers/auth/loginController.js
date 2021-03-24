
const router =  require('express').Router();

var connection = require('../../models/db');

router.get('/', function(req, res, next) {

  if(req.session.currentUser) res.redirect('/');
  res.render('login', { title: 'Login Page',loginError:"" });
});

router.post('/',function(req,res,next){
  

  const formData = {username: req.body.username, password : req.body.password};
  

  var username = req.body.username;
	var password = req.body.password;
	if (username && password) {
		connection.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
      if (results.length > 0) {
				req.session.currentUser = results[0];
				res.redirect('/');
			} else {
        res.render('login', { title: 'Login Page',loginError:"Invalid Username or Password" });
			}			
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
  }

  
});

module.exports = router;
