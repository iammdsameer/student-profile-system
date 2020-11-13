const User = require('../models/User')

const read = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    user.hashed_password = undefined
    user.salt = undefined
    res.send(user)
  } catch (error) {
    res
      .status(400)
      .send({ error: 'Error fetching data from database', success: false })
  }
}

const update = async (req, res) => {
  try {
    const { name, password } = req.body
    const user = await User.findById(req.user._id)
    if (name) {
      user.name = name
    }
    if (password && password.length > 6) {
      user.password = password
    }
    await user.save()
    user.hashed_password = undefined
    user.salt = undefined
    res.send(user)
  } catch (error) {
    res
      .status(400)
      .send({ error: 'No such user exists', success: false, error })
  }
}

module.exports = { read, update }
