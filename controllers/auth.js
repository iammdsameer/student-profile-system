const User = require('../models/User')
const { alias } = require('../helpers/alias')
const { sendEmailVerification } = require('../helpers/mailer')
const {
  generateToken,
  decodeToken,
  authenticationToken,
} = require('../helpers/tokenization')

const createUser = async (req, res) => {
  const { name, email, password } = req.body
  try {
    // Check if the user already exists
    const user = await User.findOne({ email })
    if (user) {
      return res.status(409).json({
        error: 'Account with that email already exists',
        success: false,
      })
    }
    const token = generateToken(name, email, password)
    const activationLink = await alias(
      `${process.env.CLIENT_URL}/users/activate/${token}`
    )
    // const activationLink = `${process.env.CLIENT_URL}/users/activate/${token}`
    sendEmailVerification(activationLink, email).then((sent) =>
      res.json({
        message: 'An activation link has been sent to your email',
        success: true,
      })
    )
  } catch (error) {
    // If errors occurs during query.
    res.status(500).json({
      error: 'Server understood but could not proceed with the request',
      success: false,
    })
  }
}

const activateUser = (req, res) => {
  const { token } = req.body
  const details = decodeToken(token)
  if (details.error) {
    return res.status(403).json(details)
  }
  const { name, email, password } = details
  const user = new User({ name, email, password })
  user.save((err, user) => {
    if (err)
      return res.status(500).json({
        error: 'Hmm! Something is mischievous. Retry registration.',
        success: false,
      })
    res
      .status(201)
      .json({ message: 'Congrats! Account has been verified', success: true })
  })
}

const loginUser = async (req, res) => {
  const { email, password, remember } = req.body
  const user = await User.findOne({ email })
  if (!user)
    return res.status(412).json({
      error: 'No such user exists. Sign up to create one.',
      success: false,
    })
  if (!user.authenticate(password))
    return res
      .status(401)
      .json({ error: 'Wrong email/password combination', success: false })
  const token = authenticationToken({ _id: user._id }, remember)
  const { _id, name, role } = user
  res.json({ token, user: { _id, name, email, role } })
}

module.exports = { createUser, activateUser, loginUser }
