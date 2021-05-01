const { Schema, model } = require('mongoose')

const blackList = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    level: String,
    remarks: String,
    type: String,
  },
  { timestamps: true }
)

module.exports = model('Blacklist', blackList)
