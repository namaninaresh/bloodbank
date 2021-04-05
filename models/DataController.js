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

  getProfileData = ({ userid, role }) => {
    var query1 = null;
    if (role === "donar") {
      query1 =
        "SELECT * FROM users  WHERE userid=?;select SUM(units) as totalblood from donationsinfo where userid=?;SELECT * FROM bloodinfo WHERE userid=?";
    } else {
      query1 =
        "SELECT * FROM users  WHERE userid=?;select SUM(units) as totalblood from donationsinfo where touserid=?;SELECT * FROM bloodinfo WHERE userid=?";
    }
    return this.queryExecuter(query1, [userid, userid, userid]);
  };

  getSearchData = ({ Location, Units, group }) => {
    const query =
      "SELECT * FROM bloodinfo WHERE bloodtype=? AND (bloodunits>=? AND location=?)";

    return this.queryExecuter(query, [group, Units, Location]);
  };

  registerUser = (re = []) => {
    // const query =
    //   "INSERT INTO users(firsname,lastname,username,password) values('a','a','a','a') where not exist (select username from users)";

    const query = "insert into scores value(10,34)";
    return this.queryExecuter(query);
  };

  getBloodDonatedData = ({ userid }) => {
    const query =
      "select SUM(units) as bloodonated from donationsinfo where userid=?;select SUM(bloodunits) as totalblood from bloodinfo where userid=?;select * from donationsinfo where userid=?";

    return this.queryExecuter(query, [userid, userid, userid]);
  };

  getRequestData = ({ userid, role }) => {
    var query = null;
    if (role == "donar") query = "select * from requestinfo where userid=?";
    else query = "select * from requestinfo where requesteduserid=?";

    return this.queryExecuter(query, [userid]);
  };

  putRequestData = ({
    status,
    id,
    userid,
    group,
    units,
    username,
    requser,

    requserid,
  }) => {
    if (status == "accepted") {
      const query =
        "update requestinfo set status=? where userid=? AND reqid=?;update bloodinfo set bloodunits=(select bloodunits where userid=? and bloodtype=?)-? where userid=? and bloodtype=?;update totalbloods set BloodUnits=(select BloodUnits where BloodType=?)-? where BloodType=?;insert into donationsinfo values(?,?,?,?,?,?);";

      return this.queryExecuter(query, [
        status,

        userid,
        id,
        userid,
        group,
        units,
        userid,
        group,
        group,
        units,
        group,
        userid,
        username,
        requser,
        "1/1/1",
        units,
        requserid,
      ]);
    } else {
      const query =
        "update requestinfo set status=? where userid=? AND reqid=?;";

      return this.queryExecuter(query, [status, userid, reqid]);
    }
  };

  makeRequest = ({
    userid,
    username,
    bloodtype,
    bloodunits,
    requserid,
    requser,
  }) => {
    const query = "insert ignore into requestinfo values(?,?,?,?,?,?,?,?,?)";

    const id = Math.floor(Math.random() * 14000);
    return this.queryExecuter(query, [
      id,
      userid,
      requserid,
      username,
      requser,
      bloodunits,
      "01/01/22",
      "unknown",
      bloodtype,
    ]);
  };

  deleteUser = () => {};

  addBlood = ({ type, group, Units }, { userid, username, city }) => {
    if (type === "add") {
      const innerQUery =
        "UPDATE bloodinfo SET bloodunits = (SELECT bloodunits WHERE userid=?)+? WHERE userid=? AND bloodtype=?;insert into bloodinfo select ? ,?,?,?,?  where not exists (select * from bloodinfo where userid=? and bloodtype=?) LIMIT 1;UPDATE totalbloods SET BloodUnits = (SELECT BloodUnits WHERE BloodType=?)+? WHERE BloodType=?; ";
      return this.queryExecuter(innerQUery, [
        userid,
        Units,
        userid,
        group,
        userid,
        username,
        group,
        Units,
        city,
        userid,
        group,
        group,
        Units,
        group,
      ]);
    } else {
      const remove =
        "UPDATE bloodinfo SET bloodunits = (SELECT bloodunits WHERE userid=?)-? WHERE userid=? AND (bloodtype=? AND (select bloodunits where userid=? AND bloodtype=?) > 0);UPDATE totalbloods SET BloodUnits = (SELECT BloodUnits WHERE BloodType=?)-? WHERE BloodType=? AND (SELECT bloodunits from bloodinfo WHERE userid=? AND bloodtype=?)>0";

      return this.queryExecuter(remove, [
        userid,
        Units,
        userid,
        group,
        userid,
        group,

        group,
        Units,
        group,
        userid,
        group,
      ]);
    }
  };
}

module.exports = DbService;
