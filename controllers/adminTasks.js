const User = require('../models/User')

const listOfAllUsers = async (req, res) => {
  await User.find({}).then((users) => {
    const data = users.map((user) => ({
      key: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      is_blocked: user.is_blocked,
    }))
    res.send(data)
  })
}

const deleteUser = async (req, res) => {
  try {
    await User.findOneAndDelete({ _id: req.body.key })
    res.json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const editUser = async (req, res) => {
  try {
    const { id, name, email, role, phone } = { ...req.body.data }
    await User.findOneAndUpdate({ _id: id }, { name, email, role, phone })
    res.json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const blockUser = async (req, res) => {
  try {
    const { id, status } = req.body.data
    await User.findOneAndUpdate({ _id: id }, { is_blocked: status })
    res.json({ message: 'success' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const bulkCreate = async (req, res) => {
  try {
    const { datas } = req.body
    await User.insertMany(datas, { ordered: false })
    res.json({ message: 'All data were correct and inserted successfully' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const totalUsers = async (req, res) => {
  await User.find().count((err, count) => {
    if (err) {
      return
    }
    res.json({ count })
  })
}

const blockedUsersTotal = async (req, res) => {
  await User.find({ is_blocked: true }).count((err, count) => {
    if (err) {
      return
    }
    res.json({ count })
  })
}

module.exports = {
  listOfAllUsers,
  deleteUser,
  editUser,
  blockUser,
  bulkCreate,
  totalUsers,
  blockedUsersTotal,
}
