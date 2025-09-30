import Item from '../../models/Item.js'

const getAllItems = async (req, res) => {
    try {
        const items = await Item.find({ status: "Approved" });

        if (items.length > 0) {
            return res.json({ items })
        } else {
            return res.status(204).json({ ok: false, msg: 'No Approved items in DB' })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: 'An error occurred, contact admin',
        })
    }
}

export default getAllItems
