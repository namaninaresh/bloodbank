"user strict";
//local mysql db connection
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "database-1.cqtgb3zwauvb.us-east-2.rds.amazonaws.com",
  user: "admin",
  password: "chinnanamani",
  database: "bloodbank",
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
