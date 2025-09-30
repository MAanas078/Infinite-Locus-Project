import express from 'express'
import createItem from '../controllers/Items/CreateItem.js'
import { validateJWT } from '../middlewares/validateToken.js'
import {requireModerator} from "../middlewares/requireModerator.js"
import getAllItems from '../controllers/Items/getAllItems.js'
import getAllItemsAdmin from '../controllers/Items/getAllItemsAdmin.js'

import getItemById from '../controllers/Items/getItemById.js'
import updateItem from '../controllers/Items/updateItem.js'
import deleteItem from '../controllers/Items/deleteItem.js'
import ApproveItems from '../controllers/Items/ApproveItem.js'
import RejectItems from '../controllers/Items/RejectItem.js'
const router = express.Router()

router.post('/newItem',validateJWT, createItem)
router.get('/get-items',validateJWT,requireModerator, getAllItemsAdmin)
router.get('/:id', getItemById)
router.get('/',getAllItems )
router.put('/update/:id',validateJWT, updateItem)
router.delete('/delete/:id', deleteItem)
router.patch('/:id/approved',validateJWT, requireModerator,ApproveItems)
router.patch('/:id/rejected', validateJWT,requireModerator,RejectItems)


export default router
