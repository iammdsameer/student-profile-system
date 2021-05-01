const Student = require('../models/Student')
const Blacklist = require('../models/BlackList')

const allStudents = async (req, res) => {
  await Student.find({}).then((students) => {
    const data = students.map((std) => ({
      key: std.sid,
      name: std.name,
      level: std.level,
    }))
    res.send(data)
  })
}

const allBlackListedStudents = async (req, res) => {
  await Blacklist.find({}).then((students) => {
    res.send(students)
  })
}

const addToBlacklist = async (req, res) => {
  const { name, remarks, type } = req.body
  try {
    const doc = await Student.findOne({ name })
    console.log(name, remarks, type)
    await Blacklist.create({
      key: doc.sid,
      name: doc.name,
      level: doc.level,
      remarks,
      type,
    })
    res.send({ success: true })
  } catch (err) {
    res.status(500).send({ err })
  }
}

const removeFromBlacklist = async (req, res) => {
  const { key } = req.body
  try {
    await Blacklist.findOneAndDelete({ key })
    res.send({ success: true })
  } catch (err) {
    res.status(500).send({ err })
  }
}

module.exports = {
  allStudents,
  allBlackListedStudents,
  addToBlacklist,
  removeFromBlacklist,
}
