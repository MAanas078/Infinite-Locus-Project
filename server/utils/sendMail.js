import nodemailer from 'nodemailer';

const sendOtp=async(email,otp)=>{

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
    }
});

await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify Your Email',
    text: `Your OTP is ${otp} (valid for 15 minutes)`
});

}

export default sendOtp