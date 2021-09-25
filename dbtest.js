var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'blackrhino.ce@gmail.com',
    pass: 'jerryboiiirussel'
  }
});

var mailOptions = {
  from: 'blackrhino.ce@gmail.com',
  to: 'nairabs10@gmail.com',
  subject: 'OTP - Black Rhino CE - Account Creation',
  text: ''
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});