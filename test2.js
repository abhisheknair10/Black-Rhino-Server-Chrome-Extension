var nodemailer = require('nodemailer');

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

// setup e-mail data, even with unicode symbols
var mailOptions = {
    from: '"Black Rhino CE" <info@blackrhino-ce.com>', // sender address (who sends)
    to: 'nairabs10@gmail.com', // list of receivers (who receives)
    subject: 'Hello ', // Subject line
    text: 'Hello world ', // plaintext body
    html: '<b>Hello world </b><br> This is the first email sent with Nodemailer in Node.js' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }

    console.log('Message sent: ' + info.response);
});
