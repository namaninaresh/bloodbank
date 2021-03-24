var sql = require('../models/db');

var collectData= ()=>{

    sql.query("SELECT * FROM totalbloods",
    function(err,rows,fields){
        
        if(rows.length>0) console.log(rows[0].BloodType);
       
        if(err) return({errorMessage:"Invalid Username or Password",status:400})
    });
    
    
    var dataJson  = [{bloodtype:"A+",units:100},{bloodtype:"B+",units:100},{bloodtype:"A+",units:40},{bloodtype:"A+",units:90},{bloodtype:"A+",units:50},{bloodtype:"A+",units:60},{bloodtype:"A+",units:60},{bloodtype:"A+",units:60}];

    return dataJson;

}


module.exports = collectData;