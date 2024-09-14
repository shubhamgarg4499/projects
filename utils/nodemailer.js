const nodemailer = require('nodemailer');
require('dotenv').config()
// Create a transporter
let transporter = nodemailer.createTransport({
    service: 'gmail', // You can use other services like 'yahoo', 'outlook', etc.
    auth: {
        user: 'shubhamgarg4499@gmail.com', // Your email
        pass: process.env.NODEMAILER_PASS   // Your email password
    }
});

// Set up email data

function emailOptions(to, mess) {
    return {
        from: "shubhamgarg4499@gmail.com", // Sender address
        to: to, // List of recipients
        subject: "OTP Verification", // Subject line
        text: "Please dont share it with anyone!", // Plain text body
        html: mess// HTML body
    }
}



// Send email

async function sendingMail(options) {
    transporter.sendMail(options, (error, info) => {
        if (error) {
            return error
        }
        // console.log(info);
    });

}


module.exports = { emailOptions, sendingMail }