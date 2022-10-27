const Cart = require('../model/cart');

const add_to_cart = async(req, res)=> {
    try {
        
        const cart_obj = new Cart ({
            user_id:req.body.user_id,
            food_id:req.body.food_id
        });

        const cartData =  await cart_obj.save()
        res.status(200).send({success:true, msg:"Product details", data:cartData})

    } catch (err) {
        log.error(err);
        res.status(500).json({ error: 'Error in adding the items' });
      }
}

module.exports = {
    add_to_cart 
}