import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
import postRouter from './routes/posts.js'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

app.use(express.json({ limit: "30mb", extended: true }))
app.use(express.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

// Router must be below cors() to prevent cors block
app.use('/posts', postRouter)
app.use('/', (req, res) => {
  res.send('Hello to memories API')
})

// https://www.mongodb.com/cloud/atlas
const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((error) => console.log(error.message))