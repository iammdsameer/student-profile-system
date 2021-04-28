const { Schema, model } = require('mongoose')

const studentSchema = new Schema(
  {
    sid: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: String,
    modules: {},
  },
  { timestamps: true }
)

module.exports = model('Student', studentSchema)
