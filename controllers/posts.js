import PostMessage from "../models/postMessage.js"
import mongoose from 'mongoose'

// Get all ...
export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find()
    res.status(200).json(postMessages)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Post ...
export const createPost = async (req, res) => {

  const post = req.body
  const newPost = new PostMessage(post)

  try {
    await newPost.save()
    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

// Patch ...
export const updatePost = async (req, res) => {
  const { id: _id } = req.params
  const post = req.body

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Post not found!')

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { ...post, ..._id }, { new: true })
    res.status(201).json(updatedPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

// Delete ...
export const deletePost = async (req, res) => {
  const { id: _id } = req.params

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Post not found!')

  try {
    await PostMessage.findByIdAndRemove(_id)
    res.status(201).json({ message: 'Post deleted successfully' })
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}





// Like button ...
export const likePost = async (req, res) => {
  const { id: _id } = req.params

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Post not found!')

  try {
    const post = await PostMessage.findById(_id)
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, { likeCount: post.likeCount + 1 }, { new: true })
    res.status(201).json(updatedPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}