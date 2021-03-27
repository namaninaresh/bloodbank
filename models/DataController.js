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

let instance = null;
class DbService {
  static getDbInstance() {
    return instance ? instance : new DbService();
  }

  queryExecuter = async (query, values = []) => {
    try {
      const response = await new Promise((resolve, reject) => {
        connection.query(query, values, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  getHomeData = () => {
    const query = "SELECT * FROM totalbloods";
    return this.queryExecuter(query);
  };

  getProfileData = ({ userid }) => {
    const query1 =
      "SELECT * FROM users  WHERE userid=?; SELECT * FROM totalblooddonated WHERE userid=?;SELECT * FROM bloodinfo WHERE userid=?";
    return this.queryExecuter(query1, [userid, userid, userid]);
  };

  getSearchData = ({ Location, Units, group }) => {
    const query =
      "SELECT * FROM bloodinfo WHERE bloodtype=? AND (bloodunits>=? AND location=?)";

    return this.queryExecuter(query, [group, Units, Location]);
  };
}

module.exports = DbService;
