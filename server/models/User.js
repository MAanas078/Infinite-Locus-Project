import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
    },
    fullname: {
        type: String,
    },
    img: {
        type: String,
        default:
            'https://www.softzone.es/app/uploads-softzone.es/2018/04/guest.png',
    },
    password: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    role:{
        type:String,
        enum:["User","Admin"],
        default:"User",
        
    },
    status:{
        type:String,
        default:"Not Activated",
        enum:["Not Activated","Activated"]

    }
})

const User = mongoose.model('User', userSchema)
export default User