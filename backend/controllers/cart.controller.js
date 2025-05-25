const Cart = require('../models/cart.model.js')

const getCartByUser = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.product')
        res.status(200).json(cart || { userId: req.params.userId, items: [] })
    } catch (err) {
        res.status(500).json({ message: 'Lỗi lấy giỏ hàng', error: err.message })
    }
}

const addToCart = async (req, res) => {
    const { userId, productId, quantity } = req.body

    try {
        let cart = await Cart.findOne({ userId })

        if (!cart) {
            cart = new Cart({ userId, items: [{ product: productId, quantity }] })
        } else {
            const index = cart.items.findIndex((item) => item.product.toString() === productId)
            if (index >= 0) {
                cart.items[index].quantity += quantity
            } else {
                cart.items.push({ product: productId, quantity })
            }
        }

        await cart.save()
        const populated = await cart.populate('items.product')
        res.status(200).json(populated)
    } catch (err) {
        res.status(500).json({ message: 'Lỗi thêm vào giỏ hàng', error: err.message })
    }
}

module.exports = {
    getCartByUser,
    addToCart,
}
