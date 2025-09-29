import User from '../../models/User.js';
import Otps from '../../models/Otp.js';

export const validateOtp = async (req, res) => {
    const { id } = req.params;
    const { otp } = req.body; // Destructure the OTP from the request body

    try {
        const user = await User.findById(id);
      
        

        if (!user) {
            return res.status(404).json({
                ok: false,
                msg: "The user you're trying to validate doesn't exist",
            });
        }

    const otp_saved = await Otps.findOne({ email: user.email });
    console.log(otp_saved);
    

        // Add a check here to ensure otp_saved is not null
        if (!otp_saved) {
            return res.status(404).json({
                ok: false,
                msg: 'No OTP found for this user. Please request a new one.',
            });
        }
        
        console.log(otp_saved.otp, otp);
        
        // This line will only run if otp_saved is not null
        if (otp == otp_saved.otp) {
            const userUpdated = await User.findOneAndUpdate(
                { _id: id },
                { $set: { status: 'Activated' } },
                { new: true }
            );

            if (userUpdated) {
                return res.status(200).json({ ok: true, msg: 'User Updated!', userUpdated });
            }
            
        } else {
            // Handle incorrect OTP case
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect OTP. Please try again.',
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'An error occurred, contact an administrator',
        });
    }
};