const Comment = require('../models/Comment')

const addComment = async (req, res) => {
  try {
    const { sid, comments } = req.body
    const newComment = [comments]
    // console.log(sid)
    const doc = await Comment.findOne({ sid })
    if (doc !== null) {
      await Comment.findOneAndUpdate({ sid }, { $push: { comments } })
      return res.json({ sucess: true })
    }
    await Comment.create({ sid, comments: newComment })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ err })
  }
}

const fetchComment = async (req, res) => {
  try {
    const { sid } = req.body
    const result = await Comment.findOne({ sid })
    res.json({ result })
  } catch (err) {
    res.status(500).json({ err })
  }
}

module.exports = { addComment, fetchComment }
