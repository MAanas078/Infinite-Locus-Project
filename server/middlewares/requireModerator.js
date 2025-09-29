import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const secretKey = process.env.SECRET_KEY



export const requireModerator = async (req, res, next) => {
 const authHeader = req.header('Authorization'); // "Bearer <token>"
  
  if (!authHeader) return res.status(401).send('No token provided');

  const token = authHeader.split(' ')[1]; // extract the actual toke
    try {
        if (!token) {
                return res.status(401).json({
                    ok: false,
                    msg: 'Access denied',
                })
            }
        
        
            const payload = jwt.verify(token, secretKey)
    
            const user_id = payload.id
            const user =await User.findById(user_id)
            console.log(user);
            

        if(user.role!="Admin"){
            return res.status(403).json({message:"Access denied - Admin only"})
        }
        return next()
    } catch (error) {
        console.log(error)
    }
}

export default requireModerator;
