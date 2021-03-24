const router = require('express').Router();
const sql = require('../models/db');
//const bloodModal = require('../models/bloodData');
const searchModal = require('../models/search');
router.get('/', function(req,res,next){
        const userSessionData = req.session.currentUser;
       
        sql.query("SELECT * FROM totalbloods",
        function(err,rows,fields){
            
            if(rows.length>0)
            {
              if(userSessionData) res.render('Donar/Home',{title:"Donar Home", active:"home",user: userSessionData,availableBlood: rows,searchData:""});
              else res.redirect('/auth/login');
            
            }
           
            if(err) return({errorMessage:"Invalid Username or Password",status:400})
        });

       
         
    });

router.get('/requests', function(req, res,next){

    if(req.session.currentUser)  res.render('Donar/requests',{title:"Requests Page",user: req.session.currentUser, active:"requests"});
    else res.redirect('/auth/login');
});
router.get('/profile', function(req, res,next){

    if(req.session.currentUser)  res.render('Donar/profile',{title:"Profile Page",user: req.session.currentUser, active:"profile"});
    else res.redirect('/auth/login');
});

router.get('/blooddonated', function(req, res,next){

    if(req.session.currentUser) res.render('Donar/blooddonated',{title:"BloodDonated Page",user: req.session.currentUser, active:"blooddonated"});
    else res.redirect('/auth/login');
});


router.post('/',function(req,res,next){
  const dataJson = searchModal(req.body.group, req.body.Location);

  const userSessionData = req.session.currentUser;
       
  const bloodData = bloodModal();
  if(userSessionData) res.render('Donar/Home',{title:"Donar Home", active:"home",user: userSessionData,availableBlood: bloodData,searchData:dataJson});
  else res.redirect('/auth/login');

});


router.get('/search', function(req, res,next){
    
  const userSessionData = req.session.currentUser;
    if(userSessionData)  res.render('Donar/search',{title:"Profile Page",user:userSessionData, active:"search"});
    else res.redirect('/auth/login');
});

router.get('/addblood', function(req, res,next){
    
    const userSessionData = req.session.currentUser;
      if(userSessionData)  res.render('Donar/addBlood',{title:"Add Blood Page",user:userSessionData, active:"addblood"});
      else res.redirect('/auth/login');
  });
  



module.exports = router;