const express = require('express')
const router = express.Router()
const { getCartByUser, addToCart } = require('../controllers/cart.controller.js')

router.get('/:userId', getCartByUser)
router.post('/add', addToCart)

module.exports = router
