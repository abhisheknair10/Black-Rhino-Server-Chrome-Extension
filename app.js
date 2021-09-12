const path = require('path')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
var sha256 = require('js-sha256');
var pgp = require('pg');

//-----------------------------------------------------------------------------



//-----------------------------------------------------------------------------

function financial(x) {
    return Number.parseFloat(x).toFixed(2);
}

//-----------------------------------------------------------------------------

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function generateString(length) {
    let result = '';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
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
    var username = req.params.username;
    var secret_hash = req.params.secret_hash;
    var nano = financial(1);g
    res.send(nano);
    res.end();
});

app.get('/newuser/generateuser-request', (req, res) => {
    new_user = generateUser();
    res.send(new_user);
    res.end();
});


//-----------------------------------------------------------------------------

app.listen(port, () => {
    console.log('Server is up on port ' +port)
})