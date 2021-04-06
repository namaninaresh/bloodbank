var express = require("express");
var router = express.Router();

const DbService = require("../../models/DataController");
const Db = require("../../models/db");

router.get("/", function (req, res, next) {
  res.render("register", {
    title: "Registration Page",
    active: "register",
    registerError: false,
    registerSuccess: false,
  });
});

router.post("/", function (req, res, next) {
  console.log(req.body);
  Db.query(
    "select * from users where username=? OR email=?",
    [req.body.username, req.body.email],
    function (err, rows, fields) {
      if (rows.length > 0) {
        res.render("register", {
          title: "Registration Page",
          active: "register",
          registerError: "User Already Exist",
          registerSuccess: null,
        });
      } else {
        const instance = DbService.getDbInstance();

        const result = instance.registerUser(req.body);

        result
          .then(() =>
            res.render("register", {
              title: "Registration Page",
              active: "register",
              registerError: null,
              registerSuccess: "Registration Success . Please Login",
            })
          )
          .catch((err) =>
            res.render("register", {
              title: "Registration Page",
              active: "register",
              registerError: "Unknown Error Please Try again",
              registerSuccess: null,
            })
          );
      }
    }
  );
});

module.exports = router;
