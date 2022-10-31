const Cart = require('../model/cart');
const log  = require('../log');
const async = require('hbs/lib/async');
const food = require('../model/food');
const cart = require('../model/cart');

const add_to_cart = async(req, res)=> {
    try {
        
        const cart_obj = new Cart ({
            user_id:req.user,
            food_id:req.body.food,
            quantity:req.body.quantity,
        });

        const cartData =  await cart_obj.save()
        res.status(200).send({success:true, msg:"Product details", data:cartData})

    } catch (err) {
        log.error(err);
        res.status(500).json({ error: 'Error in adding the items' });
      }
}

const deleteitems =  async (req, res) => {
    try {
        
        // const cart_obj = new Cart ({
        //     food_id:req.body.food,
        //     quantity:req.body.quantity,
        //     price:req.body.price
        // });

        // const cartData = cart_obj.save()
        // res.status(200).send({success:true, msg:"Product details", data:cartData})

        // const isPresent = Cart(quantity)
        // if (isPresent >= 0) {
        //     delete cart.food.splice(isPresent, 0);
        //     cart.totalPrice -= food.price * Cart.quantity;
        // }
        const cartFind = await Cart.find({
            $and:[
                {user_id:req.user},
                {food_id:req.body.food_id}
            ]
        })

        await Cart.findByIdAndDelete (cartFind._id)
        res.send("food Item deleted")
        


    } catch (err) {
        log.error(err);
        res.status(500).json({ error: 'Error in deleting the items' });
    }
}


const updateCart = async (req, res) => {

    const cartFind = await Cart.find({
        $and:[
            {user_id:req.user},
            {food_id:req.body.food_id}
        ]
    })

    const updateCart = await Cart.findByIdAndUpdate(
        cartFind._id, {quantity:req.body.quantity}
    )

    res.send('quantity updated')
}
 
modules.exports = {
    updateCart, deleteitems, add_to_cart
}