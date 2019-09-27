const express = require('express')
const router = express.Router()

const { 
  register, 
  login,
  getUser, 
  userProfile } = require('../controllers/user')
const auth  = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/me', auth, userProfile)
router.get('/', getUser)

module.exports = router