const router = require('express').Router();
const session = require('express-session');

router.use(session({secret:"er"}));

router.get('/',function(req, res,next){

    // req.session.destroy((err) => {
    //     if(err) {
    //         return console.log(err);
    //     }
    //     res.redirect('/');
    // });

    req.session.destroy((err)=>{
        if(err) console.log(err);

        res.redirect('/auth/login');

    })

});



module.exports = router;