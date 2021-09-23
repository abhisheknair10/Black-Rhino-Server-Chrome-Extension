const path = require('path')
const express = require('express')
const sha256 = require('js-sha256')
const fs = require('fs')
const { Pool } = require('pg')
const nodemailer = require('nodemailer')

const app = express()
const port = process.env.PORT || 3000

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
    return Number.parseFloat(x).toFixed(5);
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

app.get('/', (req, res) => {
    res.send("WEEEEEEEEEE")
});

app.get('/checkurl/:username/:theurl', (req, res) => {
    const queryurl = async () => {
        var username = req.params.username
        var theurl = req.params.theurl
        theurl = theurl.split('-').join('/')
        console.log(theurl)

        var result = await pool.query(`SELECT * FROM ads WHERE adurl = $1;`, [theurl]);
        if(result.rows[0] == null){
            console.log("This Website is not Advertised on Black Rhino")
        }
        else{
            console.log("This Website is Advertised on Black Rhino")
            var userresult = await pool.query(`
            SELECT * FROM mainuserdata WHERE username = $1;`, [username]);
            if(userresult.rows[0].ads.includes(result.rows[0].adid)){
            }
            else{
                appended_arr = userresult.rows[0].ads
                appended_arr.push(result.rows[0].adid)
                var appenddb = await pool.query(`
                UPDATE mainuserdata SET ads = $1 WHERE username = $2;`, [appended_arr, username])
                if(result.rows[0].tierscompleted[0] < result.rows[0].targetpeople[0]){
                    var updateuserbtc = await pool.query(`
                    UPDATE mainuserdata SET btc = $1 WHERE username = $2`, 
                    [result.rows[0].tiers[0] + userresult.rows[0].btc, username])
                    
                    var update_arr = [parseInt(result.rows[0].tierscompleted[0]) + 1, parseInt(result.rows[0].tierscompleted[1]), parseInt(result.rows[0].tierscompleted[2])]
                    var updateuserbtc = await pool.query(`
                    UPDATE ads SET tierscompleted = $1 WHERE adid = $2`, 
                    [update_arr, result.rows[0].adid])
                }
                else if(result.rows[0].tierscompleted[1] < result.rows[0].targetpeople[1]){
                    var updateuserbtc = await pool.query(`
                    UPDATE mainuserdata SET btc = $1 WHERE username = $2`, 
                    [result.rows[0].tiers[1] + userresult.rows[0].btc, username])

                    var update_arr = [parseInt(result.rows[0].tierscompleted[0]), parseInt(result.rows[0].tierscompleted[1]) + 1, parseInt(result.rows[0].tierscompleted[2])]
                    console.log(update_arr)
                    var updateuserbtc = await pool.query(`
                    UPDATE ads SET tierscompleted = $1 WHERE adid = $2`, 
                    [update_arr, result.rows[0].adid])
                }
                else if(result.rows[0].tierscompleted[2] < result.rows[0].targetpeople[2]){
                    var updateuserbtc = await pool.query(`
                    UPDATE mainuserdata SET btc = $1 WHERE username = $2`, 
                    [result.rows[0].tiers[2] + userresult.rows[0].btc, username])

                    var update_arr = [parseInt(result.rows[0].tierscompleted[0]), parseInt(result.rows[0].tierscompleted[1]), parseInt(result.rows[0].tierscompleted[2]) + 1]
                    console.log(update_arr)
                    var updateuserbtc = await pool.query(`
                    UPDATE ads SET tierscompleted = $1 WHERE adid = $2`, 
                    [update_arr, result.rows[0].adid])
                }
            }
        }
        res.send("Done")
        res.end()
    }
    queryurl()
});

app.get('/main/:username/:secret_hash', (req, res) => {
    const getUserData = async () => {
        var username = req.params.username;
        var secret_hash = req.params.secret_hash;
        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1;`, [username]);
        if(result.rows[0].shahash == secret_hash){
            var btc = financial(result.rows[0].btc);
            console.log(btc)
            res.send(btc);
            res.end();
        }
        else{
            res.send("ID Not Validated");
            res.end();
        }
    }
    getUserData()
});

app.get('/newuser/generateuser-request/:email', (req, res) => {
    const connToDatabase = async () => {
        new_user = generateUser();
        new_username = new_user.split("<>")[0];
        new_secret_hash = new_user.split("<>")[1];
        var email = req.params.email;

        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1;`, [new_username]);
        if(result.rows == ""){
            console.log("User Does Not Exists")
            console.log(result.rows);
            var postToDatabase = await pool.query(`INSERT INTO mainuserdata VALUES ($1, $2, $3, $4, $5);`, [new_username, new_secret_hash, 0.00, [], email]);
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

app.get('/withdraw/:username/:hash/:walletaddr', (req, res) => {
    console.log(req.params.walletaddr)
    res.send("sa")
    res.end()
});

app.get('/hints/:username', (req, res) => {
    const hints = async () => {
        var username = req.params.username;
        var adsresult = await pool.query(`SELECT * FROM ads ORDER BY adid DESC;`);
        var userresult = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1`, [username]);
        var ret_array = []
        for (let i = 0; i < adsresult.rows.length; i++) {
            if(userresult.rows[0].ads.includes(adsresult.rows[i].adid)){
            }
            else{
                ret_array.push(adsresult.rows[i].adhint)
                ret_array.push("<>")
            }
        }
        console.log(ret_array)
        res.send(ret_array.join(''))
        res.end()
    }
    hints()
});

//-----------------------------------------------------------------------------

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})