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
  const { name } = req.body
  try {
    const doc = await Student.findOne({ name })
    await Blacklist.create({ sid: doc.sid, name: doc.name, level: doc.level })
    res.send({ success: true })
  } catch (err) {
    res.status(500).send({ err })
  }
}

module.exports = { allStudents, allBlackListedStudents, addToBlacklist }
