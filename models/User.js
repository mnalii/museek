/* eslint-disable camelcase */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('Email is not valid');
      }
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 6,
  },
  profile_picture: {
    type: Object
  },
  role: {
    type: String,
    enum: ['musician', 'customer']
  },
  verified: {
    type: String,
    enum: ['pending', 'approve', 'reject']
  },
  price: {
    type: Number
  },
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  address: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  skill: [String],
  description: {
    type: String
  },
  rating: [Number],
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

userSchema.methods.toJSON = function () {
  const user = this;

  const userObject = user.toObject();

  if (userObject.role === 'customer') {
    delete userObject.skill;
    delete userObject.rating;
  }

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.getUserToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_KEY);

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('No email found!');
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error('Unable to login!');
  }

  return user;
};

userSchema.plugin(uniqueValidator);
const User = mongoose.model('User', userSchema);
module.exports = User;
