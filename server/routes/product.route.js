// IMPORTS
const express = require('express');
const {createProduct,
       getAllProduct,
       getSingleProductById,
       updateProduct,
       deleteProduct} = require('../controllers/product.controllers');
const { authenticateUser, adminAuthorization } = require('../middleware/auth.middleware');

const router = express.Router()





// routes
router.post('/create',authenticateUser,adminAuthorization,createProduct)
router.get('/all',getAllProduct)
router.get('/:id',getSingleProductById)
router.patch('/:id',authenticateUser,adminAuthorization,updateProduct)
router.delete('/:id',authenticateUser,adminAuthorization,deleteProduct)





// exports
module.exports = router