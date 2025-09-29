import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../models/User.js';
dotenv.config();

const secretKey = process.env.SECRET_KEY

export const validateJWT = async (req, res, next) => {

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

        req.id = payload.id
        const user = await User.findById(payload.id)
        console.log(user);

        
        if(user.status!="Activated"){
          return res.status(200).json({
            ok: false,
            msg: 'Not Verified.Please contact admin',
        })
        }
        return next()
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            ok: false,
            msg: 'Token not valid',
        })
    }
}

export default validateJWT;
