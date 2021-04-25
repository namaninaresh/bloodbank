"use strict";
var express = require("express");
var router = express.Router();

const nodemailer = require("nodemailer");

router.get("/", function (req, res, next) {
  var token__code = Math.floor(Math.random() * 10000);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "namaninaresh1996@gmail.com",
      pass: "chinna.8686",
    },
  });

  var mailOptions = {
    from: "namaninaresh1996@gmail.com",
    to: "lovelychinna799@gmail.com",
    subject: "OTP for Blood Bank",
    text: `Generated Otp is ${token__code} ,this otp will expire with  in 1 hour.`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  console.log(token__code);

  res.render("OtpGen");
});

module.exports = router;
