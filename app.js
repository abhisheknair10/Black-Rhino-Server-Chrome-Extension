const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var sha256 = require('js-sha256')
const fs = require("fs")
const { Pool } = require('pg')

//-----------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}

//-----------------------------------------------------------------------------

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const generateRandomNumber = (min, max) =>  {
    return Math.floor(Math.random() * (max - min) + min);
};

function generateUser(){
    num = generateRandomNumber(1000000000, 9999999999);
    user = "user" + num;
    randomString = generateString(30);
    var secretHash = sha256.create();
    secretHash.update(randomString);
    secretHash.hex();

    return user + "<>" + secretHash
}

//-----------------------------------------------------------------------------

app.set("view engine", "ejs");

app.get('/main/:username/:secret_hash', (req, res) => {
    const getUserData = async () => {
        var username = req.params.username;
        var secret_hash = req.params.secret_hash;
        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1;`, [username]);
        if(result.rows[0].shahash == secret_hash){
            var xlm = financial(result.rows[0].xlm);
            console.log(xlm)
            res.send(xlm);
            res.end();
        }
        else{
            res.send("ID Not Validated");
            res.end();
        }
    }
    getUserData()
});

app.get('/newuser/generateuser-request', (req, res) => {
    const connToDatabase = async () => {
        new_user = generateUser();
        new_username = new_user.split("<>")[0];
        new_secret_hash = new_user.split("<>")[1];

        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1;`, [new_username]);
        if(result.rows == ""){
            console.log("User Does Not Exists")
            console.log(result.rows);
            var postToDatabase = await pool.query(`INSERT INTO mainuserdata VALUES ($1, $2, $3, $4);`, [new_username, new_secret_hash, 0.00, null]);
        }
        else{
            new_user = "userfound";
            console.log(result.rows);
        }
        console.log("Sending")
        res.send(new_user);
        res.end();
    }
    connToDatabase()
});

app.get('/recover/account/:username/:hash', (req, res) => {
    const recoverAccount = async () => {
        var username = req.params.username;
        var secret_hash = req.params.hash;

        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1;`, [username]);
        try{
            if(secret_hash == result.rows[0].shahash){
                res.send("200");
                res.end();
            }
            else{
                res.send("1000");
            }
        }
        catch(error){
            console.log(error)
            res.send("1000");
            res.end();
        }
    }
    recoverAccount()
});

app.get('/withdraw/:username/:hash/:walletaddr/:amount', (req, res) => {
    res.send("Ha")
    res.end()
});

app.get('/hints/:username', (req, res) => {
    const hints = async () => {
        var username = req.params.username;
        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1;`, [username]);
        result = result.rows[0];
        
    }
    hints()
});

//-----------------------------------------------------------------------------

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})