const router = require('express').Router()

const { createUser, activateUser, loginUser } = require('../controllers/auth')

const {
  registrationBody,
  authenticationBody,
} = require('../helpers/auth.validation')
const { validate } = require('../helpers/check.validation')

router.post('/new', registrationBody, validate, createUser)
router.post('/activate-new', activateUser)
router.post('/login', authenticationBody, validate, loginUser)

module.exports = router
