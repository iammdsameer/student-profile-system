const User = require('../models/User')
const { alias } = require('../helpers/alias')
const { sendEmailVerification } = require('../helpers/mailer')
const { OAuth2Client } = require('google-auth-library')
const {
  generateToken,
  decodeToken,
  authenticationToken,
  decodeIdFromToken,
  signAToken,
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
    sendEmailVerification(
      activationLink,
      email,
      'newAccount',
      'emailVerification'
    ).then((sent) =>
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

const createUserViaAdmin = async (req, res) => {
  const { name, email, role, phone } = req.body
  const password = process.env.USER_DEFAULT_PASS
  try {
    // Check if the user already exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(409).json({
        error: 'Account with that email already exists',
        success: false,
      })
    }
    user = new User({ name, email, password, role, phone })
    let newUser = await user.save()
    // console.log(newUser)
    if (newUser) {
      const token = authenticationToken(
        { _id: newUser._id },
        process.env.ACCOUNT_RESET_SECRET
      )
      await newUser.updateOne({ resetPasswordLink: token })
      const link = `${process.env.CLIENT_URL}/users/new-activation/${token}`
      const activationLink = await alias(link)
      sendEmailVerification(
        activationLink,
        email,
        'newAccountByAdmin',
        'newAccountByAdmin'
      )
        .then((sent) =>
          res.json({
            message: 'An activation link has been sent to the email',
            success: true,
          })
        )
        .catch((err) => {
          console.log(err)
        })
    }
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
  const details = decodeToken(token, process.env.SECRET_KEY)
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

  if (user.is_blocked)
    return res.status(401).json({
      error: 'You are not allowed to continue to use the system',
      succes: false,
    })
  const token = authenticationToken(
    { _id: user._id },
    process.env.ACCOUNT_LOGIN_SECRET,
    remember
  )
  const { _id, name, role, phone } = user
  res.json({ token, user: { _id, name, email, role, phone } })
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    // token will expire in 2 hour.
    const token = authenticationToken(
      { _id: user._id },
      process.env.ACCOUNT_RESET_SECRET
    )
    const activationLink = await alias(
      `${process.env.CLIENT_URL}/users/recovery/${token}`
    )
    await user.updateOne({ resetPasswordLink: token })
    sendEmailVerification(
      activationLink,
      email,
      'recoverAccount',
      'forgotPasswordVerification'
    ).then((sent) =>
      res.json({
        message: 'A reset password link has been sent to your email',
        success: true,
      })
    )
  } catch (error) {
    res.status(422).send({
      error: 'No such user exists. Re-check your email',
      success: false,
    })
  }
}

const resetPassword = async (req, res) => {
  const { resetPasswordLink, newPassword } = req.body
  if (resetPasswordLink) {
    const status = decodeIdFromToken(
      resetPasswordLink,
      process.env.ACCOUNT_RESET_SECRET
    )
    if (status) {
      User.findOne({ resetPasswordLink }, (err, doc) => {
        if (err)
          return res
            .status(500)
            .send({ error: 'Error establishing connection with database' })
        doc.password = newPassword
        doc.resetPasswordLink = ''
        doc.save((errors, docu) => {
          if (errors) return res.status(500).send({ error: 'DB Error' })
          return res.send({
            message: 'Password has been changed successfully',
            succes: true,
          })
        })
      })
    }
  } else {
    return res.status(403).send({ error: 'No token found', success: false })
  }
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
const googleLogin = async (req, res) => {
  const { idToken } = req.body
  try {
    const response = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    // console.log(response.payload)
    const { email_verified, name, email } = response.payload
    if (email_verified) {
      let user = await User.findOne({ email })
      if (user) {
        if (user.is_blocked) {
          return res.status(401).json({
            error: 'You are not allowed to continue to use the system',
            succes: false,
          })
        }
        const token = signAToken(
          { _id: user._id },
          process.env.ACCOUNT_LOGIN_SECRET
        )
        const { _id, name, role, phone } = user
        return res.json({ token, user: { _id, email, name, role, phone } })
      }

      let password = email + process.env.ACCOUNT_LOGIN_SECRET
      user = new User({ name, email, password })
      await user.save()
      const token = signAToken(
        { _id: user._id },
        process.env.ACCOUNT_LOGIN_SECRET
      )
      return res.json({
        token,
        user: {
          _id: user._id,
          email,
          name,
          role: user.role,
          phone: user.phone,
        },
      })
    }
    return res
      .status(403)
      .send({ error: 'Permission was denied', success: false })
  } catch (error) {
    console.log(error)
    res.status(500).send({ error: 'Google OAuth Error', success: false })
  }
}

const changePassword = async (req, res) => {
  const { id, current, nayapassword } = req.body.data
  User.findOne({ _id: id }, (err, doc) => {
    if (err)
      return res
        .status(500)
        .send({ error: 'Error establishing connection with database' })
    if (!doc.authenticate(current))
      return res
        .status(401)
        .json({ error: 'Current password is incorrect.', success: false })
    doc.password = nayapassword
    doc.save((errors, docu) => {
      if (errors) return res.status(500).send({ error: 'DB Error' })
      return res.send({
        message: 'Password has been changed successfully',
        succes: true,
      })
    })
  })
}

module.exports = {
  createUser,
  createUserViaAdmin,
  activateUser,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  googleLogin,
}
