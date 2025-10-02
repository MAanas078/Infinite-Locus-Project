import nodemailer from 'nodemailer';

const sendOtp = async (email, otp) => {
    // Using the explicit host and port is more reliable than 'service: "Gmail"'
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports like 587
        auth: {
            user: process.env.EMAIL,
            // IMPORTANT: For Gmail, you MUST use an "App Password" if 2FA is enabled.
            // Your regular account password will not work.
            pass: process.env.EMAIL_PASS
        }
    });

    // You can uncomment this verify block to test your connection during server startup
    /*
    try {
        await transporter.verify();
        console.log('Successfully connected to the email server.');
    } catch (error) {
        console.error('Failed to connect to the email server. Check your configuration.', error);
        return; // Stop execution if connection fails
    }
    */

    try {
        await transporter.sendMail({
            from: `"Your App Name" <${process.env.EMAIL}>`, // Good practice to set a sender name
            to: email,
            subject: 'Verify Your Email',
            text: `Your OTP is ${otp} (valid for 15 minutes)`,
            html: `<p>Your OTP is <b>${otp}</b> (valid for 15 minutes)</p>` // Include HTML for better formatting
        });
        console.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error);
    }
};

export default sendOtp;
