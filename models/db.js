"user strict";
//local mysql db connection
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "chinna",
  database: "bloodbank",
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) throw err;
});

module.exports = connection;
