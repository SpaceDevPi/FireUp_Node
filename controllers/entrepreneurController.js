const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Entrepreneur = require('../model/entrepreneurModel')

// @desc    Register new entrepreneur
// @route   POST /api/entrepreneurs
// @access  Public
const registerEntrepreneur = asyncHandler(async (req, res) => {
  const { username, email, password, firstname, lastname, phone, address, city, state, zip } = req.body

  if (!username || !email || !password || !firstname || !lastname || !phone || !address || !city || !state || !zip  ) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if entrepreneur exists
  const entrepreneurExists = await Entrepreneur.findOne({ email })

  if (entrepreneurExists) {
    res.status(400)
    throw new Error('entrepreneur already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create entrepreneur
  const entrepreneur = await Entrepreneur.create({
    username,
    email,
    password: hashedPassword,
    firstname,
    lastname,
    phone,
    address,
    city,
    state,
    zip
  })

  if (entrepreneur) {
    res.status(201).json({
      _id: entrepreneur.id,
      username: entrepreneur.username,
      email: entrepreneur.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid entrepreneur data')
  }
})

// @desc    Authenticate a entrepreneur
// @route   POST /api/entrepreneurs/login
// @access  Public
const loginEntrepreneur = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for entrepreneur email
  const entrepreneur = await Entrepreneur.findOne({ email })

  if (entrepreneur && (await bcrypt.compare(password, entrepreneur.password))) {
      console.log('entrepreneur', entrepreneur)
    res.json({
      _id: entrepreneur.id,
      username: entrepreneur.username,
      email: entrepreneur.email,
      token: generateToken(entrepreneur._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Get user data
// @route   GET /api/entrepreneur/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

module.exports = {
  registerEntrepreneur,
  loginEntrepreneur,
  getMe,
}