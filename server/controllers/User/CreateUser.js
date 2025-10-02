import User from '../../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Otp from '../../models/Otp.js';
import sendOtp from '../../utils/sendMail.js';
dotenv.config();

const secretKey = process.env.SECRET_KEY

const generateJWT = async (id) => {
    const token = jwt.sign({ id }, secretKey, {
        expiresIn: '24h',
    })
    return token
}


const createUser = async (req,res) => {
    const userData = req.body

    const data = {
        members: [
            {
                email_address: userData.email,
            },
        ],
    }

    const postData = JSON.stringify(data)

    try {
        const findUser = await User.findOne({ email: userData.email })
        if (findUser) {
            return res.status(200).json({
                ok: false,
                msg: 'The email is already used',
            })
        }

        const newUser = new User(userData)

        //Encrypt password
        const salt = bcrypt.genSaltSync()
        newUser.password = bcrypt.hashSync(newUser.password, salt)

        //Generate JWT
        const token = await generateJWT(newUser.id)

        await newUser.save()
        
       // 1️⃣ Generate OTP once
        const otp = Math.floor(100000+Math.random()*900000).toString();

        // 2️⃣ Save OTP in DB and await it
        await Otp.findOneAndUpdate(
            { email: newUser.email }, // search existing OTP
            { otp: otp, email: newUser.email, otpExpires: Date.now() + 15*60*1000 }, // update or create
            { upsert: true, new: true } // create if not exist
        );

        // 3️⃣ Send the SAME OTP via email
        try {
            await sendOtp(newUser.email, otp)
        } catch (error) {
            console.log('SendGrid error:', error);
        }
        

        res.json({id:newUser.id});
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            ok: false,
            msg: 'An error occured, contact an administrator',
        })
    }
}

export default createUser
