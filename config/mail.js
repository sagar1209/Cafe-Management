const nodemailer = require('nodemailer');
require('dotenv').config({path : '../.env'});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sagarsenjaliya423@gmail.com', 
        pass: process.env.EMAIL_KEY
    }
});

const forgotpasswordMail = async(mailOptions)=>{
    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error("Error occurred:", error);
      } else {
        console.log("Email sent successfully:", info.response);
      }
    });
}

const sendReportmail = async(mailOptions)=>{
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error occurred:", error);
    } else {
      console.log("Email sent successfully:", info.response);
    }
  });
}

module.exports = {
    forgotpasswordMail
    ,sendReportmail
}

