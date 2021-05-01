const { Schema, model } = require('mongoose')

const moduleSchema = new Schema({
  sid: {
    type: String,
    required: true,
  },
  comments: [],
})

module.exports = model('Comment', moduleSchema)
