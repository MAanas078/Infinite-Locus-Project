import express from 'express'

import createUser from '../controllers/user/createUser.js'
import { loginUser } from '../controllers/user/LoginUser.js'
import { renewToken } from '../controllers/user/renewToken.js'
import { updateUser } from '../controllers/user/updateUser.js'
import { validateJWT } from '../middlewares/validateToken.js'
import {validateOtp} from "../controllers/User/ValidateOtp.js"
import { getUsers } from '../controllers/User/TotalUser.js'
import requireModerator from '../middlewares/requireModerator.js'

const router = express.Router()


router.post('/create', createUser)
router.put('/update/:id', validateJWT, updateUser)
router.post('/login', loginUser)
router.post('/renew', validateJWT, renewToken)
router.post('/verify-otp/:id',validateOtp )
router.get('/get-users/',validateJWT,requireModerator,getUsers )

export default router
