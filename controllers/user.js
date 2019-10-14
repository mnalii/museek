const User = require('../models/User');
const { verifiedEmail } = require('../services/email');
const { uri } = require('../middleware/cloudinaryUpload');
const { uploader } = require('../config/cloudinaryConfig');


const register = async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).json({
    error: {
      message: 'Email is already registered. Please use another email'
    }
  });
  user = new User(req.body);
  try {
    await user.save();
    const token = await user.getUserToken();
    verifiedEmail(user.email, user.name, token, user.role);
    res.status(201).send({
      user,
      response: {
        message: 'User succesfully registered',
        success: true
      }
    });
  } catch (error) {
    res.status(400).send({
      error: {
        message: error.message
      }
    });
  }
};

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = await user.getUserToken();
    res.status(200).json({
      user,
      response: {
        message: 'Success login',
        success: true
      }, token
    });
  } catch (error) {
    res.status(400).send({
      error: {
        message: error.message
      }
    });
  }
};

const getUser = async (req, res) => {
  const { role } = req.query;
  var query = {};
  /* istanbul ignore if */
  if (role) {
    query = { role };
  }
  try {
    const users = await User.find(query);
    res.send(users);
  } catch (error) {
    /* istanbul ignore next */
    res.status(400).send(error.message);
  }
};

/* istanbul ignore next */
const userProfile = async (req, res) => {
  res.send(req.user);
};

/* istanbul ignore if */
const editProfile = async (req, res) => {
  /* istanbul ignore if */
  if (req.user.role === 'musician') {
    const updates = Object.keys(req.body);
    const updateFields = ['name', 'email', 'password', 'profile_picture', 'price', 'gender', 'address', 'city', 'country', 'skill', 'description'];
    const isValidFields = updates.every((update) => updateFields.includes(update));

    if (!isValidFields) return res.status(400).send({ error: 'Invalid updates!' });

    try {
      updates.forEach((update) => req.user[update] = req.body[update]);
      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  } else if (req.user.role === 'customer') {
    const updates = Object.keys(req.body);
    const updateFields = ['name', 'email', 'password', 'profile_picture', 'gender', 'address', 'city', 'country'];
    const isValidFields = updates.every((update) => updateFields.includes(update));

    if (!isValidFields) return res.status(400).send({ error: 'Invalid updates!' });

    try {
      updates.forEach((update) => req.user[update] = req.body[update]);
      await req.user.save();
      res.send(req.user);
    } catch (e) {
      res.status(400).send(e);
    }
  }
};

const uploadAvatar = async (req, res, next) => {
  const id = req.user._id;
  if (req.file) {
    const file = uri(req).content;
    var response = {};
    try {
      response = await uploader.upload(file);
    } catch (error) {
      /* istanbul ignore next */
      res.status(500).json({
        message: error
      });
    }
    // eslint-disable-next-line camelcase
    return User.findByIdAndUpdate({ _id: id }, { $set: { profile_picture: response } }, (error, result) => {
      /* istanbul ignore if */
      if (error) {
        return res.status(500).json({
          message: error
        });
      }
      return res.status(201).json({
        message: 'Avatar Uploaded'
      });
    });
  }
  /* istanbul ignore next */
  return res.status(404).json({
    message: 'No image selected'
  });
};

const updateFcmToken = (req, res, next) => {
  const id = req.user._id;
  let query = { $set: { fcmToken: req.body.fcmToken } };
  if (req.body.fcmToken === 'notoken') {
    query = { $set: { fcmToken: null } };
  }
  return User.findByIdAndUpdate({ _id: id }, query, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Failed update fcm token' });
    }
    return res.status(200).json({ message: 'FCM Token updated' });
  });
};


module.exports = {
  register,
  login,
  userProfile,
  editProfile,
  getUser,
  uploadAvatar,
  updateFcmToken
};
