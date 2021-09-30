const path = require('path')
const express = require('express')
const fs = require('fs')
const { Client } = require('pg')
const nodemailer = require('nodemailer')
const CryptoAccount = require("send-crypto");

//------------------------------------------------------------------------------------

const client = new Client({
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

client.connect()

//------------------------------------------------------------------------------------

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blackrhino.ce@gmail.com',
        pass: 'jerryboiiirussel'
    }
});

function financial(x) {
    return Number.parseFloat(x).toFixed(5);
}

//------------------------------------------------------------------------------------


async function withdraw(){
    var query = await client.query(`SELECT * FROM withdrawrequests LIMIT 1;`)
    result = query.rows[0]
    if(result != null){
        var privateKey = "beaa9540abe34f4b97c751d1283d66a86073bd9b460365a07b0aaa3e259a840b";
        var account = new CryptoAccount(privateKey);
        //t1MDPgTFbgS5TyRsJjFVh3c7JHAUJv5iwJZ

        //console.log(await account.address("ZEC"));
        //console.log(await account.getBalance("ZEC"));

        await account.send(
            result.walletaddr, 
            result.zwith, 
            "ZEC", 
            {subtractFee: true}
        ).on("transactionHash", console.log).on("confirmation", console.log);

        var mailcontent = "Dear Black Rhino CE User,\n\n" + financial(result.zwith) + " ZCASH has been transfered to " + result.walletaddr + ".\n\n Black Rhino CE"
        var mailOptions = {
            from: 'blackrhino.ce@gmail.com',
            to: result.emailaddr,
            subject: 'Withdrawal Notification',
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
        var query2 = await client.query(`DELETE FROM withdrawrequests WHERE username = $1;`, [result.username])
    }
    else{
        var privateKey = "beaa9540abe34f4b97c751d1283d66a86073bd9b460365a07b0aaa3e259a840b";
        var account = new CryptoAccount(privateKey);
        console.log('No Requests. Balance: ZEC ' + await account.getBalance("ZEC"))
    }
};

async function forever(){
    while(true){
        await withdraw()
    }    
}

forever()

//------------------------------------------------------------------------------------