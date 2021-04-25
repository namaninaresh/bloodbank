var express = require("express");

const nodemailer = require("nodemailer");

function genOTP(emailTo) {
  var token__code = Math.floor(Math.random() * 10000);

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "namaninaresh1996@gmai.com",
      pass: "chinna.8686",
    },
  });

  var mailOptions = {
    from: "BloodBank <namaninaresh1996@gmail.com>",
    to: emailTo,
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

  return token__code;
}

// router.get("/", function (req, res, next) {
//   // const otp__token = genOTP();
//   const otp__token = 5566;
//   res.render("verification", {
//     title: "Registration Page",
//     active: "register",
//     otp__token,
//   });
// });

module.exports = genOTP;
