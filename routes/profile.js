const { route } = require('./auth')

const router = require('express').Router()
const { read, update } = require('../controllers/profile')
const { verifyStoredToken } = require('../helpers/tokenization')

router.get('/:id', verifyStoredToken, read)
router.put('/update', verifyStoredToken, update)

module.exports = router
