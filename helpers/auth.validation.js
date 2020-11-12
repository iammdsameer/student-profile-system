const { check } = require('express-validator')

const registrationBody = [
  check('name')
    .isLength({ min: 3 })
    .withMessage('Name must have 3 letters at minimum'),
  check('email').isEmail().withMessage('Must be a valid email address '),
  check('password')
    .isLength({ min: 6, max: 28 })
    .withMessage('Password must be in between 6-28 characters'),
]

const authenticationBody = [
  check('email').isEmail().withMessage('Must be a valid email address '),
  check('password')
    .isLength({ min: 6, max: 28 })
    .withMessage('Password must be in between 6-28 characters'),
]

module.exports = { registrationBody, authenticationBody }
