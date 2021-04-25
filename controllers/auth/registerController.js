var express = require("express");
var router = express.Router();

const DbService = require("../../models/DataController");
const Db = require("../../models/db");

const verifyController = require("../auth/verifyController");

router.get("/", function (req, res, next) {
  res.render("register", {
    title: "Registration Page",
    active: "register",
    registerError: false,
    registerSuccess: false,
  });
});

function emailHidder(email) {
  let stars = email.slice(3, email.indexOf("@") - 2).length;
  let pattern = "";
  for (let i = 0; i < stars; i++) pattern += "*";

  return email.replace(email.substring(3, email.indexOf("@") - 2), pattern);
}

router.post("/", function (req, res, next) {
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
        let otp__token = verifyController(req.body.email);
        req.body.email = emailHidder(req.body.email);

        res.render("verification", {
          title: "Registration Page",
          active: "register",
          data: req.body,
          otp__token,
        });
      }
    }
  );
});

router.post("/verify", function (req, res, next) {
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
});
module.exports = router;
