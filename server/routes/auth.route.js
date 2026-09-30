const express = require('express');
const {registerUser, loginUser, createAdmin} = require('../controllers/auth.controllers')
const router = express.Router()







router.post('/register', registerUser)
router.post('/register/admin', createAdmin)
router.post('/login', loginUser)
// router.post('/logout', logoutUser)

module.exports = router