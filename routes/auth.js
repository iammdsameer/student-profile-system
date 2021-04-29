const router = require('express').Router()

const {
  listOfAllUsers,
  deleteUser,
  editUser,
  blockUser,
  bulkCreate,
  bulkCreateStudents,
  totalUsers,
  blockedUsersTotal,
  moduleCreate,
  moduleReturn,
  deleteModule,
  listOfAllStudents,
  studentLevelReturn,
  totalStudents,
  clearStudents,
} = require('../controllers/adminTasks')
const {
  createUser,
  activateUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword,
  createUserViaAdmin,
  googleLogin,
} = require('../controllers/auth')

const {
  registrationBody,
  authenticationBody,
  forgotPasswordBody,
  resetPasswordBody,
} = require('../helpers/auth.validation')
const { validate } = require('../helpers/check.validation')

router.post('/auth/google', googleLogin)
router.post('/activate-new', activateUser)
router.post('/admin/users-list', listOfAllUsers)
router.post('/admin/student-list', listOfAllStudents)
router.delete('/admin/delete-user', deleteUser)
router.put('/admin/edit-user', editUser)
router.get('/admin/total-users-count', totalUsers)
router.post('/admin/student-level-return', studentLevelReturn)
router.get('/admin/blocked-users-count', blockedUsersTotal)
router.put('/admin/block-user', blockUser)
router.post('/admin/bulk-create', bulkCreate)
router.post('/admin/bulk-create-students', bulkCreateStudents)
router.post('/new', registrationBody, validate, createUser)
router.post('/new-via-admin', registrationBody, validate, createUserViaAdmin)
router.post('/login', authenticationBody, validate, loginUser)
router.put('/reset-password', resetPasswordBody, validate, resetPassword)
router.put('/forgot-password', forgotPasswordBody, validate, forgotPassword)
router.put('/change-password', changePassword)
router.post('/admin/create-module', moduleCreate)
router.post('/admin/return-module', moduleReturn)
router.delete('/admin/delete-module', deleteModule)
router.get('/admin/total-students', totalStudents)
router.post('/admin/remove-students', clearStudents)

module.exports = router
