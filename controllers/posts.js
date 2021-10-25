import PostMessage from "../models/postMessage.js"
import mongoose from 'mongoose'

// Get all ...
export const getPosts = async (req, res) => {

  const { page } = req.query

  try {

    const LIMIT = 8
    const startIndex = (Number(page) - 1) * LIMIT // starting index of every page
    const total = await PostMessage.countDocuments({})

    const posts = await PostMessage.find()
      .sort({ _id: -1 }) // newest post first
      .limit(LIMIT)
      .skip(startIndex)

    res.status(200).json({
      data: posts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT)
    })

  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Search ...
export const getPostsBySearch = async (req, res) => {
  console.log('XXXXXXXXXXXXXXXXXX');
  // QUERY = /posts?page=1 -> page = 1
  // PARAMS = /posts/123 -> id = 123

  const { searchQuery, tags } = req.query
  console.log(searchQuery)

  try {
    const title = new RegExp(searchQuery, 'i') // case insensitive

    const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] })

    res.json({ data: posts })
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Get for detail ...
export const getPost = async (req, res) => {
  const { id } = req.params
  try {
    const post = await PostMessage.findById(id)
    res.status(200).json(post)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

// Post ...
export const createPost = async (req, res) => {

  const post = req.body
  const newPost = new PostMessage({ ...post, creator: req.userId, createdAt: new Date().toISOString() })

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

  if (!req.userId) return res.json({ message: 'Unauthenticated.' })

  if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('Post not found!')

  try {
    const post = await PostMessage.findById(_id)

    // Make 1 user only 1 time like the post ...
    const index = post.likes.findIndex(id => id === String(req.userId))
    if (index === -1) {
      // Like the post ...
      post.likes.push(req.userId)
    } else {
      // Dislike the post ...
      post.likes = post.likes.filter(id => id !== String(req.userId))
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, { new: true })

    res.status(201).json(updatedPost)

  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

// Comment button ...
export const commentPost = async (req, res) => {

  const { id } = req.params
  const { value } = req.body


  try {
    const post = await PostMessage.findById(id)

    post.comments.push(value)

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

    res.json(updatedPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}