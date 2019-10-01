const express = require('express')
const router = express.Router()

const {
  register,
  login,
  getUser,
  userProfile,
  editProfile,
  uploadAvatar
} = require('../controllers/user')
const auth = require('../middleware/auth')
const {
  multerUploads
} = require('../middleware/cloudinaryUpload');

router.post('/register', register)
router.post('/login', login)
router.get('/profile', auth, userProfile)
router.put('/profile', auth, editProfile)
router.get('/', getUser)
router.put('/upload-avatar', auth, multerUploads.single('avatar'), uploadAvatar)

module.exports = router