require('dotenv').config();
const sendEmail = require('./utils/emailService');

async function test() {
    console.log('Testing email user:', process.env.EMAIL_USER);
    console.log('Testing email pass:', process.env.EMAIL_PASS);

    await sendEmail({
        email: process.env.EMAIL_USER, // send to self
        subject: 'Test Email from Academic Portal',
        message: 'If you are reading this, the email configuration is working!'
    });
}

test();
