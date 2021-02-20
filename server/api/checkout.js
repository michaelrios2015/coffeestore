const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const { models: { Coffee, User, Cart  }} = require('../db');
module.exports = router;

router.put("/:uid/:cartId", async (req, res, next) => {
    try {
        let cart = await Cart.findOne({
            where: {userId: req.params.uid, id: req.params.cartId}
        })

        if(cart.open === false){
            const error = new Error("Cart Alredy Closed")
            error.status = 400
            throw error
        }

        if(!cart){
            const error = new Error("No Cart Found")
            error.status = 402
            throw error
        }

        cart.open = false
        await cart.save()
        res.sendStatus(204)

    } catch (ex) {
        next(ex)
    }
})

router.post("/session", async (req, res, next) => {
    // console.log('-----------------------------------------------------');
    // console.log(process.env.STRIPE_SECRET_KEY);
    try {
        const {token, total} = req.body

        const customer = await stripe.customers.create({
            email: token.email,
            source: token.id
        })

        const charge = await stripe.charges.create({
            amount: total*100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "Coffee Products Oh no :)",
            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip,
                    state: token.card.address_state
                }
            },
        })

        if(charge){
            res.sendStatus(200)
        }else{
            const error = new Error("Unable To Charge")
            error.status = 402
            throw error
        }
    } catch (ex) {
        next(ex)
    }
})
