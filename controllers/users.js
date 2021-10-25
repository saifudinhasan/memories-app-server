import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from "../models/user.js"

export const signin = async (req, res) => {

  const { email, password } = req.body

  try {

    // Get the user ... 
    const existingUser = await User.findOne({ email })
    if (!existingUser) return res.status(404).json({ message: "User doesn't exist." })

    // Authenticate the password ... 
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials." })

    // Send jwt token ... 
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, 'the_secret_jwt_password', { expiresIn: "1h" })
    res.status(200).json({ result: existingUser, token })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const signup = async (req, res) => {

  const { firstName, lastName, email, password, confirmPassword } = req.body

  try {

    // Check if the user is already exist ... 
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ message: "User already exist." })

    // Check if the password and confirmPassword are same ... 
    if (password !== confirmPassword) return res.status(400).json({ message: "Password don't match." })

    // Hash the password ... 
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create the user ... 
    const result = await User.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` })

    // Send jwt token ... 
    const token = jwt.sign({ email: result.email, id: result._id }, 'the_secret_jwt_password', { expiresIn: "1h" })
    res.status(200).json({ result, token })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}