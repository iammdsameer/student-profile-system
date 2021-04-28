const { Schema, model } = require('mongoose')

const moduleSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    level: ['6', '5', '4'],
    required: true,
  },
  color: String
})

module.exports = model('Module', moduleSchema)
