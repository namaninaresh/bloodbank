const router = require("express").Router();

router.get("/", function (req, res, next) {
  // req.session.destroy((err) => {
  //     if(err) {
  //         return console.log(err);
  //     }
  //     res.redirect('/');
  // });

  req.session.destroy((err) => {
    if (err) console.log(err);

    res.redirect("/auth/login");
  });
});

module.exports = router;
