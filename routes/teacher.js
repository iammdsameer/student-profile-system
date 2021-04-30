const router = require('express').Router()

const {
  allStudents,
  allBlackListedStudents,
  addToBlacklist,
} = require('../controllers/teacherTasks')

router.post('/get-students', allStudents)
router.post('/get-blacklisted-students', allBlackListedStudents)
router.post('/add-to-blacklist', addToBlacklist)
module.exports = router
