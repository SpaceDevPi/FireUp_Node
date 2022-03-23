const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Entrepreneur = require('../model/entrepreneurModel')
const sendEmail = require('../utils/mail');
const Token = require('../model/token');
const crypto = import("crypto");

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
    // Generate token
    let token = await new Token({
      entrepreneurId: entrepreneur._id,
      token: crypto.randomBytes(32).toString('hex')
    }).save()
  
    const message = `${process.env.BASE_URL}/entrepreneurs/verify/${entrepreneur._id}/${token.token}`
  
    await sendEmail(entrepreneur.email, 'Verify your email', message)
  
    res.send("An Email sent to your account please verify");

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

// @desc    Verify email
// @route   GET /api/entrepreneurs/verify/:id/:token
// @access  Private
const verifyEmail = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id)
  if (!entrepreneur) {
    res.status(400).send('Invalid link')
  }
  const token = await Token.findOne({
    entrepreneurId: entrepreneur._id,
    token: req.params.token
  })
  if (!token) {
    res.status(400).send('Invalid link')
  }

  await Entrepreneur.updateOne({ _id: entrepreneur._id }, { valid: true })
  await Token.deleteOne({ _id: token._id })

  res.send('Email verified successfully')

})

// @desc    Authenticate a entrepreneur
// @route   POST /api/entrepreneurs/login
// @access  Public
const loginEntrepreneur = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  // Check for entrepreneur email
  const entrepreneur = await Entrepreneur.findOne({ email })

  if (entrepreneur.valid == true && (await bcrypt.compare(password, entrepreneur.password))) {
      console.log('entrepreneur', entrepreneur)
    res.json({
      _id: entrepreneur.id,
      validation: entrepreneur.valid,
      token: generateToken(entrepreneur._id),
    })
  } else {
    if (entrepreneur.valid == false) {
      res.status(400)
      throw new Error('entrepreneur not validated')
    } else {
      res.status(400)
      throw new Error('Invalid credentials')
    }
  }
})

// @desc    Get Entrepreneur data
// @route   GET /api/entrepreneur/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.entrepreneur)
})

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

//@desc  Update entrepreneur data
//@route PUT /api/entrepreneurs/:id
//@access Private
const updateEntrepreneur = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!entrepreneur) {
    res.status(400)
    throw new Error('Invalid entrepreneur data')
  }

  res.status(200).json(entrepreneur)
})

//@desc  Delete entrepreneur
//@route DELETE /api/entrepreneurs/:id
//@access Private
const deleteEntrepreneur = asyncHandler(async (req, res) => {
  await Entrepreneur.findByIdAndDelete(req.params.id)

  res.status(200).json({
    message: 'entrepreneur deleted',
  })
})

//@desc  Get all entrepreneurs
//@route GET /api/entrepreneurs
//@access Private
const getAllEntrepreneurs = asyncHandler(async (req, res) => {
  const entrepreneurs = await Entrepreneur.find()

  res.status(200).json(entrepreneurs)
})

//@desc Update entrepreneur password
//@route PUT /api/entrepreneurs/security/:id
//@access Private
const updateEntrepreneurPassword = asyncHandler(async (req, res) => {
  const { password } = req.body

  if (!password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Update password

  const entrepreneur = await Entrepreneur.findByIdAndUpdate(req.params.id, {
    password: hashedPassword,
  })

  if (!entrepreneur) {
    res.status(400)
    throw new Error('Invalid entrepreneur data')
  }

  res.status(200).json(entrepreneur)
})

//@desc update entrepreneur validation
//@route PUT /api/entrepreneurs/validate/:id
//@access Private
const updateEntrepreneurValidation = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findByIdAndUpdate(req.params.id, {
    valid : true,
  })

  if (!entrepreneur) {
    res.status(400)
    throw new Error('Invalid entrepreneur data')
  }

  res.status(200).json(entrepreneur)
})




module.exports = {
  registerEntrepreneur,
  loginEntrepreneur,
  getMe,
  updateEntrepreneur,
  deleteEntrepreneur,
  getAllEntrepreneurs,
  updateEntrepreneurPassword,
  updateEntrepreneurValidation,
  verifyEmail,
}