const { Pool } = require('pg')
const fs = require("fs");

const pool = new Pool({
    user: 'doadmin',
    host: 'black-rhino-cluster-do-user-9771361-0-5bd2.b.db.ondigitalocean.com',
    database: 'defaultdb',
    password: 'gIlTlPDrHR2BZkTF',
    port: 25060,
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync("ca-certificate.crt").toString()
    }
})
pool.connect()

pool.query(`SELECT * FROM mainuserdata WHERE username = 'user10';`, (err, res)=>{
    if(!err){
        if(res.rows == ""){
            console.log("User Does not Exist");
        }
        else{
            console.log("User Exists")
        }
    }
    else {
        console.log(err.message);
    }
    pool.end();
})