import Item from '../../models/Item.js'
import User from '../../models/User.js'

const ApproveItems = async (req,res) => {      
    try {
        const item_id = req.params.id
        const item  =await Item.findByIdAndUpdate(item_id,{status:"Approved"},{new:true});
        res.status(200).json({ ok: true, msg: 'Item Approved' })
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: error.message,
        })
    }
}

export default ApproveItems
