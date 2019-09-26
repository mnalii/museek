const express = require('express')
const router = express.Router()

const { 
  register, 
  login,
  logout, 
  userProfile } = require('../controllers/user')
const auth  = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', auth, logout)
router.get('/me', auth, userProfile)

module.exports = router