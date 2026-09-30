const express = require('express');
const {registerUser, loginUser, createAdmin, getCurrentUser} = require('../controllers/auth.controllers')
const { authenticateUser } = require('../middleware/auth.middleware');
const router = express.Router()







router.post('/register', registerUser)
router.post('/register/admin', createAdmin)
router.post('/login', loginUser)
router.get('/me', authenticateUser, getCurrentUser)
// router.post('/logout', logoutUser)

module.exports = router