const router = require('express').Router()

const {
  createUser,
  activateUser,
  loginUser,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require('../controllers/auth')

const {
  registrationBody,
  authenticationBody,
  forgotPasswordBody,
  resetPasswordBody,
} = require('../helpers/auth.validation')
const { validate } = require('../helpers/check.validation')

router.post('/new', registrationBody, validate, createUser)
router.post('/activate-new', activateUser)
router.post('/login', authenticationBody, validate, loginUser)
router.put('/forgot-password', forgotPasswordBody, validate, forgotPassword)
router.put('/reset-password', resetPasswordBody, validate, resetPassword)
router.post('/auth/google', googleLogin)

module.exports = router
