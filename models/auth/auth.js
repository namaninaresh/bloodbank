 var sql = require('../db');




    // var execute = function()
    //     {
    //         sql.query("SELECT * FROM usedrs WHERE username=? AND password=? ",['chinna','cahinna'],
    //         function(err,rows,fields){
    //             if(err) return({errorMessage:"Invalid Username or Password"})
    //             if(rows.length >0) return rows[0];

    //         });
    //     }








var login =function({username,password}){

  

  
        if(username==="a" && password==="a"){
            console.log('camer');
            var userData = {};
            sql.query("SELECT * FROM users WHERE username=? AND password=? ",[username,password],
            function(err,rows,fields){
                if(rows.length >0) {
                    console.log('camer into sql')
                    userData = { ...rows[0],status:200};
                    
                }
                if(err) return({errorMessage:"Invalid Username or Password",status:400})
            });
              
            console.log('exit from mysql');
                return userData;
        }
        else if(username==='b' && password==='b')
        {
            const userData = {username:"chinna",firstname:"c",lastname:"n",id:2,accessToken:12113234234,status:200,isDonar:true};
            return userData;
        }
        else{
            
            const userData= { error: "invalid User",status:401};
            return userData;
        }
    }
module.exports={login};