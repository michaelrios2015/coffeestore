const router = require('express').Router();
const { Sequelize } = require('sequelize');
const { models: { User, Coffee, Cart_Coffee, Cart }  } = require('../db');

// Shows list of closed carts (aka orders) for a given user
router.get('/:userId', async (req, res, next) => {
    try{
        const listOfClosedCarts = await Cart.findAll({
            where: {
                // id: req.params.userId,
                // think this is what we want
                userId: req.params.userId,    
                open: 'false'
            }
        });
        res.status(201).send(listOfClosedCarts);
    } catch(ex) {
        next(ex);
    }
})


// Shows list of ordered coffees for a given closed cart (aka order) and given user
// Also pulls coffee information to provide order details
router.get('/:userId/:cartId', async (req, res, next) => {
    try{     
        const orderedCoffees = await Cart_Coffee.findAll({
            include: [{
                model: Cart,
                where: {
                    id: req.params.cartId,    
                    open: 'false',
                },
                include: [{
                    model: Coffee,
                }],
            }] 
        });
       
        res.status(201).send(orderedCoffees);
    } catch(ex) {
        next(ex);
    }
})

module.exports = router;