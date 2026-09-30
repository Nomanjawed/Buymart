const express = require('express');
const router = express.Router()
const authRoutes = require('./auth.route')
const productRoutes = require('./product.route')
const orderRoutes = require('./order.route')





// routes
router.use('/auth', authRoutes)
router.use('/product', productRoutes)
router.use('/order', orderRoutes)









module.exports = router