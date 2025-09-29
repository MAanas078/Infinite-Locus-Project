import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email:{type:String},
  otp:{type:String},
  otpExpiiry:{type:Date,default:Date.now()+15*60*1000
  },
  createdAt:{type:Date,default:Date.now()}
})

const Otps = mongoose.model('Otps', otpSchema)
export default Otps