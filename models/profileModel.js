const sql = require('./db');

let instance=null;

class DbService{

    static getDbServiceInstance()
    {
        return instance ? instance : new DbService();
    }
    
}

var currentUserProfile = async (response)=>{

    const queryString = 'select * from users where userid=?';
    await sql.query(queryString,[response.userid],(err, rows, fields)=>{


        if(err) console.log(err.message);

        return rows;

    });

}


module.exports = {currentUserProfile};