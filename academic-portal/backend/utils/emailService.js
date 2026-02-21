const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Check if email configuration is provided
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn('⚠️ EMAIL_USER or EMAIL_PASS not set. Email notification skipped.');
            return;
        }

        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // or use host/port if not gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Define the email options
        const mailOptions = {
            from: `Academic Portal <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html, // Optional HTML message
        };

        // Actually send the email
        await transporter.sendMail(mailOptions);
        console.log(`✉️ Email successfully sent to ${options.email}`);
    } catch (error) {
        console.error(`❌ Error sending email to ${options.email}:`, error.message);
    }
};

module.exports = sendEmail;
