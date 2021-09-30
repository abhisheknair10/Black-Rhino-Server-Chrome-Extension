const path = require('path')
const express = require('express')
const sha256 = require('js-sha256')
const fs = require('fs')
const { Pool } = require('pg')
const nodemailer = require('nodemailer')
const CryptoAccount = require("send-crypto");

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

// Send ZEC Function

//-----------------------------------------------------------------------------

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blackrhino.ce@gmail.com',
        pass: 'jerryboiiirussel'
    }
});

//-----------------------------------------------------------------------------

function financial(x) {
    return Number.parseFloat(x).toFixed(5);
}

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

        var userresult = await pool.query(`
        SELECT * FROM mainuserdata WHERE username = $1;`, [username]);

        if(userresult.rows[0].verified == 1){
            var result = await pool.query(`SELECT * FROM ads WHERE adurl = $1;`, [theurl]);
            if(result.rows[0] == null){
                console.log("This Website is not Advertised on Black Rhino")
            }
            else{
                console.log("This Website is Advertised on Black Rhino")
                returnval = 1;
                if(userresult.rows[0].ads.includes(result.rows[0].adid)){
                }
                else{
                    appended_arr = userresult.rows[0].ads
                    appended_arr.push(result.rows[0].adid)
                    var appenddb = await pool.query(`
                    UPDATE mainuserdata SET ads = $1 WHERE username = $2;`, [appended_arr, username])
                    if(result.rows[0].tierscompleted[0] < result.rows[0].targetpeople[0]){
                        var updateuserzcash = await pool.query(`
                        UPDATE mainuserdata SET zcash = $1 WHERE username = $2`, 
                        [result.rows[0].tiers[0] + userresult.rows[0].zcash, username])
                        
                        var update_arr = [parseInt(result.rows[0].tierscompleted[0]) + 1, parseInt(result.rows[0].tierscompleted[1]), parseInt(result.rows[0].tierscompleted[2])]
                        var updateuserzcash = await pool.query(`
                        UPDATE ads SET tierscompleted = $1 WHERE adid = $2`, 
                        [update_arr, result.rows[0].adid])
                    }
                    else if(result.rows[0].tierscompleted[1] < result.rows[0].targetpeople[1]){
                        var updateuserzcash = await pool.query(`
                        UPDATE mainuserdata SET zcash = $1 WHERE username = $2`, 
                        [result.rows[0].tiers[1] + userresult.rows[0].zcash, username])
    
                        var update_arr = [parseInt(result.rows[0].tierscompleted[0]), parseInt(result.rows[0].tierscompleted[1]) + 1, parseInt(result.rows[0].tierscompleted[2])]
                        console.log(update_arr)
                        var updateuserzcash = await pool.query(`
                        UPDATE ads SET tierscompleted = $1 WHERE adid = $2`, 
                        [update_arr, result.rows[0].adid])
                    }
                    else if(result.rows[0].tierscompleted[2] < result.rows[0].targetpeople[2]){
                        var updateuserzcash = await pool.query(`
                        UPDATE mainuserdata SET zcash = $1 WHERE username = $2`, 
                        [result.rows[0].tiers[2] + userresult.rows[0].zcash, username])
    
                        var update_arr = [parseInt(result.rows[0].tierscompleted[0]), parseInt(result.rows[0].tierscompleted[1]), parseInt(result.rows[0].tierscompleted[2]) + 1]
                        console.log(update_arr)
                        var updateuserzcash = await pool.query(`
                        UPDATE ads SET tierscompleted = $1 WHERE adid = $2`, 
                        [update_arr, result.rows[0].adid])
                    }
                }
            }
        }
        res.send(userresult.rows[0].verified+"")
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
            var zcash = financial(result.rows[0].zcash);
            console.log(zcash)
            res.send(zcash);
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

        randomString = generateString(30);
        var otphash = sha256.create();
        otphash.update(randomString);
        otphash.hex();
        otphash = otphash + ""

        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1;`, [new_username]);
        var emailver = await pool.query(`SELECT * FROM mainuserdata WHERE emailaddr = $1;`, [email]);
        if(result.rows[0] == null && emailver.rows[0] == null){
            console.log("User Does Not Exists")
            console.log(result.rows);
            var postToDatabase = await pool.query(`INSERT INTO mainuserdata VALUES ($1, $2, $3, $4, $5, $6, $7);`, [new_username, new_secret_hash, 0.00, [], email, otphash, 0]);
            var mailcontent = 'Dear Black Rhino CE User,\n\nPlease click the link below to verify your account to start earning from Black Rhino CE.\n\n' + 'blackrhino-ce.com/verify/' + otphash + "\n\nBlack Rhino CE"
            var mailOptions = {
                from: 'blackrhino.ce@gmail.com',
                to: 'nairabs10@gmail.com',
                subject: 'Verify - Black Rhino CE - Account Creation',
                text: mailcontent
            };
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } 
                else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        else if(emailver.rows[0] == null){
            new_user = "userfound";
            console.log("User Found")
        }
        else{
            new_user = "emailfound";
            console.log("Email Found")
        }
        console.log("Sending")
        res.send(new_user);
        res.end();
    }
    connToDatabase()
});

app.get('/verify/:otphash', (req, res) => {
    const verifyaccount = async () => {
        var otphash = req.params.otphash;
        var result = await pool.query(`SELECT * FROM mainuserdata WHERE otplink = $1;`, [otphash]);
        if(result.rows[0] != null){
            var updateverification = await pool.query(`UPDATE mainuserdata SET verified = $1 
            WHERE otplink = $2`, [1, otphash])
            res.send("Your Account has been Verified")
            res.end()
        }
        else{
            res.send("Link Does Not Exist")
            res.end()
        }
    }
    verifyaccount()
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
    const withdraw = async () => {
        var username = req.params.username;
        var hash = req.params.hash;
        var walletaddr = req.params.walletaddr;
        var amount = req.params.amount;
        var retval = ""
        
        var result = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1`, [username]);
        if(result.rows[0] != null){
            if(result.rows[0].shahash == hash){
                if(amount <= result.rows[0].zcash){
                    var checkwithreq = await pool.query(`SELECT * FROM withdrawrequests WHERE username = $1`, [username]);
                    if(checkwithreq.rows[0] == null){
                        var userdata = await pool.query(`SELECT * FROM mainuserdata WHERE username = $1`, [username])
                        var remainingamount = userdata.rows[0].zcash - amount
                        var updatezcash = await pool.query(`UPDATE mainuserdata SET zcash = $1 
                        WHERE username = $2`, [remainingamount, username])
                        var postToDatabase = await pool.query(`INSERT INTO withdrawrequests VALUES ($1, $2, $3, $4, $5);`, [username, hash, amount, walletaddr, userdata.rows[0].emailaddr]);
                        retval = "sent-to-wallet"
                        console.log("Sent To Wallet")
                    }
                    else{
                        retval = "request-already-there"
                        console.log("Withdraw Request Already Exists")
                    }
                }
                else{
                    retval = "too-much-amount"
                    console.log("Incorrect Amount")
                }
            }
            else{
                retval = "wrong-hash"
                console.log("Wrong Hash")
            }
        }
        else{
            retval = "non-existent"
            console.log("User Does not Exist")
        }
        res.send(retval)
        res.end()
    }
    withdraw()
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