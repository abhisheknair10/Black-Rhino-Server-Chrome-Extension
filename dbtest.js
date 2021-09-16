const { Pool } = require('pg')
const pool = new Pool({
    user: 'doadmin',
    host: 'black-rhino-cluster-do-user-9771361-0-5bd2.b.db.ondigitalocean.com',
    database: 'defaultdb',
    password: 'gIlTlPDrHR2BZkTF',
    port: 25060,
})
pool.connect()

pool.query(`Select * from mainuserdata`, (err, res)=>{
    if(!err){
        console.log(res.rows);
    }
    else {
        console.log(err.message);
    }
    pool.end;
})