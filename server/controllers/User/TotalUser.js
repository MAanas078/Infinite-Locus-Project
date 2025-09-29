import User from '../../models/User.js'
import dotenv from 'dotenv'
dotenv.config();



export const getUsers = async (req, res) => {

    try {
        const users = await User.find()
        const totalUsers = await User.countDocuments({});
 

        return res.status(200).json({
            ok: true,
            users:users,
            totalUsers:totalUsers,
            msg: 'Users fetched',
        })
    } catch (error) {
        console.log(error)
        return res.status(404).json({
            ok: false,
            msg: 'An error occured, contact an administrator',
        })
    }
}

