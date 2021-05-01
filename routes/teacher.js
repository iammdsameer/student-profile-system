const router = require('express').Router()

const {
  allStudents,
  allBlackListedStudents,
  addToBlacklist,
  removeFromBlacklist,
} = require('../controllers/teacherTasks')

router.post('/get-students', allStudents)
router.post('/get-blacklisted-students', allBlackListedStudents)
router.post('/add-to-blacklist', addToBlacklist)
router.post('/remove-from-blacklist', removeFromBlacklist)
module.exports = router
