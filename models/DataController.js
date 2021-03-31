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

  addBlood = ({ type, group, Units }, { userid }) => {
    const remove =
      "UPDATE bloodinfo SET bloodunits = (SELECT bloodunits WHERE userid=?)-? WHERE userid=? AND bloodtype=?;UPDATE totalbloods SET BloodUnits = (SELECT BloodUnits WHERE BloodType=?)-? WHERE BloodType=? AND (SELECT bloodunits from bloodinfo WHERE userid=?)>0";
    const add =
      "UPDATE bloodinfo SET bloodunits = (SELECT bloodunits WHERE userid=?)+? WHERE userid=? AND bloodtype=?;UPDATE totalbloods SET BloodUnits = (SELECT BloodUnits WHERE BloodType=?)+? WHERE BloodType=? AND (SELECT bloodunits from bloodinfo WHERE userid=?)>0";

    const query = type == "add" ? add : remove;
    return this.queryExecuter(query, [
      userid,
      Units,
      userid,
      group,
      group,
      Units,
      group,
      userid,
    ]);
  };

  registerUser = (re = []) => {
    // const query =
    //   "INSERT INTO users(firsname,lastname,username,password) values('a','a','a','a') where not exist (select username from users)";

    const query = "insert into scores value(10,34)";
    return this.queryExecuter(query);
  };

  getBloodDonatedData = () => {
    const query =
      "select bloodunits from totalblooddonated where userid=1;select SUM(bloodunits) as totalblood from bloodinfo where userid=1;select * from donationsinfo where userid=1";

    return this.queryExecuter(query);
  };
}

module.exports = DbService;
