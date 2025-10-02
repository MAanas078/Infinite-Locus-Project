import sgMail from '@sendgrid/mail';

const sendOtp = async (email, otp) => {
    try {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const msg = {
            from: {
                email: process.env.EMAIL_FROM, // must be verified
                name: "Lost & Found"
            },
            to: email,
            templateId: process.env.SENDGRID_TEMPLATE_ID, // your dynamic template ID
            dynamic_template_data: {
                otp: otp, // variable used in template
            },
        };

        await sgMail.send(msg);
        console.log(`OTP email sent successfully to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP to ${email}:`, error);
        if (error.response) console.error(error.response.body);
    }
};

export default sendOtp;
