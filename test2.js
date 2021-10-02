const fs = require('fs')
const nodemailer = require('nodemailer')
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

// Create the transporter with the required configuration for Outlook
// change the user and pass !
var transporter = nodemailer.createTransport({    
    service: 'Godaddy',
    host: "smtpout.secureserver.net",  
    secureConnection: true,
    port: 465,
    auth: {
        user: "info@blackrhino-ce.com",
        pass: "jerryboiiirussel" 
    }
});

var mailOptions = {
    from: '"Black Rhino CE" <info@blackrhino-ce.com>',
    to: email,
    subject: 'Verify - Black Rhino CE - Account Creation',
    html: await readFile('/htmlcontent/verifymail.html', 'utf8'),
};
transporter.sendMail(mailOptions, function(error, info){
    if (error) {
        console.log(error);
    } 
    else {
        console.log('Email sent: ' + info.response);
    }
});