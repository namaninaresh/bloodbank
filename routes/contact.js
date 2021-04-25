var express = require("express");
var router = express.Router();

const nodemailer = require("nodemailer");

function sendMail({ username, email, message }) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "namaninaresh1996@gmai.com",
      pass: "chinna.8686",
    },
  });

  var mailOptions = {
    from: username + "< " + email + " >",
    to: "namaninaresh1996@gmail.com",
    subject: "Support Message from Blood Bank",
    text: message,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return token__code;
}

router.get("/", function (req, res, next) {
  res.render("contactus", { title: "Contact Page", active: "contact" });
});

router.post("/", function (req, res, next) {
  //sendMail(req.body);
  console.log(req.body);
});

module.exports = router;
