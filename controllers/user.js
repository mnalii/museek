const User = require('../models/User')
const { verifiedEmail } = require('../services/email')


const register = async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.getUserToken()
    verifiedEmail(user.email, user.name, token)
    res.status(201).send(user)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const login = async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.getUserToken()
    res.status(200).send({user, token})
  } catch (error) {
    res.status(400).send(error.message)
    console.log(error)
  }
}

const getUser = async (req, res) => {
  const {role} = req.query;
  var query = {};
  if (role) {
    query = { role };
  }
  try {
    const users = await User.find(query)
    res.send(users)
  } catch (error) {
    res.status(400).send(error.message)
  }
}

const userProfile = async (req, res) => {
  res.send(req.user)
}


module.exports = {
  register,
  login,
  userProfile,
  getUser
}