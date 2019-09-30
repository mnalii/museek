const express = require('express')
const router = express.Router()

const { 
  register, 
  login,
  getUser, 
  userProfile,
  editProfile } = require('../controllers/user')
const auth  = require('../middleware/auth')

router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, userProfile)
router.put('/profile', auth, editProfile)
router.get('/', getUser)

module.exports = router