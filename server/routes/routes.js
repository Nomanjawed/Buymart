const express = require('express');
const router = express.Router()
const authRoutes = require('./auth.route')
const productRoutes = require('./product.route')





// routes
router.use('/auth', authRoutes)
router.use('/product', productRoutes)









module.exports = router