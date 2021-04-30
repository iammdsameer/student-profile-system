const { Schema, model } = require('mongoose')

const blackList = new Schema(
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
  },
  { timestamps: true }
)

module.exports = model('Blacklist', blackList)
