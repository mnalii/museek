const express = require('express');
const router = express.Router();

const {
  register,
  login,
  getUser,
  userProfile,
  editProfile,
  uploadAvatar,
  updateFcmToken,
  getUserId
} = require('../controllers/user');
const auth = require('../middleware/auth');
const { multerUploads } = require('../middleware/cloudinaryUpload');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, userProfile);
router.put('/profile', auth, editProfile);
router.get('/', getUser);
router.put(
  '/upload-avatar',
  auth,
  multerUploads.single('avatar'),
  uploadAvatar
);
router.put('/fcm-token', auth, updateFcmToken);
router.get('/:id', getUserId);

module.exports = router;
