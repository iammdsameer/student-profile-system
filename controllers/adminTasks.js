const User = require('../models/User')
const Module = require('../models/Module')
const Student = require('../models/Student')

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

const listOfAllStudents = async (req, res) => {
  await Student.find({}).then((i) => {
    const data = i.map((e) => {
      return {
        key: e._id,
        name: e.name,
        modules: e.modules,
        sid: e.sid,
        level: e.level,
      }
    })
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

const deleteModule = async (req, res) => {
  try {
    await Module.findOneAndDelete({ _id: req.body.key })
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

const bulkCreateStudents = async (req, res) => {
  try {
    const { datas } = req.body
    const is_empty = (await Student.find({})).length
    // console.log(is_empty)
    if (is_empty === 0) {
      const refined_data = datas.map((e) => ({
        ...e,
        modules: { [e.module]: parseInt(e.percent.split('%')[0]) },
      }))
      await Student.insertMany(refined_data, { ordered: false })
    } else {
      datas.forEach(async (e) => {
        const doc = await Student.findOneAndUpdate(
          { sid: e.sid },
          {
            // `modules.${e.module}`: parseInt(e.percent.split('%')[0]),
            $set: {
              ['modules.' + e.module]: parseInt(e.percent.split('%')[0]),
            },
          }
        )
        if (doc === null) {
          await Student.create({
            ...e,
            modules: { [e.module]: parseInt(e.percent.split('%')[0]) },
          })
        }
      })
    }
    // await Student.insertMany(refined_data, { ordered: false })
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

const moduleCreate = async (req, res) => {
  try {
    const { data } = req.body
    await Module.create({
      level: data.level,
      title: data.title,
      color: data.color,
    })
    res.json({ message: 'Module has been created' })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const moduleReturn = async (req, res) => {
  try {
    const { data } = req.body
    if (data.level === 'all') {
      modules = await Module.find({})
    } else {
      modules = await Module.find({ level: data.level })
    }
    res.json({ modules })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const studentLevelReturn = async (req, res) => {
  try {
    const students = await Student.find({})
    var levelOneStudents = []
    var levelTwoStudents = []
    students.forEach((e) => {
      var black_modules = Object.values(e.modules).filter((e) => e < 40).length
      e.key = e._id
      if (black_modules === 2) {
        levelOneStudents.push(e)
      }
      if (black_modules > 2) {
        levelTwoStudents.push(e)
      }
    })
    res.json({ levelTwoStudents, levelOneStudents })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const totalStudents = async (req, res) => {
  try {
    const students = await Student.find({})
    res.json({ count: students.length })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

const clearStudents = async (req, res) => {
  try {
    await Student.remove({})
    res.json({
      message:
        'All Student Records were cleared. Go to Upload Records to reupload new records',
    })
  } catch (err) {
    res.status(500).json({ error: err })
  }
}

module.exports = {
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
}
