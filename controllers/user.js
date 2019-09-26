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
    res.send({user, token})
  } catch (error) {
    res.status(400).send(error.message)
    console.log(error)
  }
}

const logout = async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send(req.user)
  } catch (error) {
    res.status(500).send(error.message)
  }
}

const userProfile = async (req, res) => {
  res.send(req.user)
}


module.exports = {
  register,
  login,
  logout,
  userProfile
}