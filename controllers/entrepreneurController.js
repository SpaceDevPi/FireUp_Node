const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const Entrepreneur = require('../model/entrepreneurModel')
const Company = require('../model/companyModel')
const sendEmail = require('../utils/mail');
const Token = require('../model/token');
const crypto = import("crypto");
const mongoose = require('mongoose');
const {google} = require ('googleapis');
const nodemailer = require("nodemailer");
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID , process.env.CLIENT_SECRET , process.env.REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token : process.env.REFRESH_TOKEN});

const nanoid = require('nanoid');



// @desc    Register new entrepreneur
// @route   POST /api/entrepreneurs
// @access  Public
const registerEntrepreneur = asyncHandler(async (req, res) => {
  const { 
    email, 
    password, 
    firstname, 
    lastname,
    birthday,
    villenaissance, 
    phone, 
    address, 
    city, 
    state, 
    zip ,
    companyName, 
    companyAddress, 
    companyZip, 
    companyCity, 
    companyPhone, 
    companyEmail, 
    companyWebsite,
    companySector,
    companySize,
    companyService,
  } = req.body

  // if (!email || !password || !firstname || !lastname || !birthday || !villenaissance || !phone || !address || !city || !state || !zip  || !companyName || !companyAdresse || !companyZip || !companyCity || !companyPhone || !companyEmail || !companyWebsite  || !companySize || !companyService) {
  //   res.status(400)
  //   throw new Error('Please add all fields')
  // }

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
  const entrepreneur = new Entrepreneur({
    email,
    password: hashedPassword,
    firstname,
    lastname,
    birthday,
    villenaissance,
    phone,
    address,
    city,
    state,
    zip,
  }).save().then(entrepreneur => {
    console.log(entrepreneur)

    let token = new Token({
      entrepreneurId: entrepreneur._id.toString(),
      token: generateToken(entrepreneur._id),
    }).save().then(token => {
      console.log(token)
      const id = entrepreneur._id.toString()
      const mail =`
      <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <!-- LOGO -->
          <tr>
              <td bgcolor="#FFA73B" align="center">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                          <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                          <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                              <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome to <span style=" color :#FFA73B;">Fire up! </span></h1> <img src=" https://img.icons8.com/clouds/100/000000/handshake.png" width="125" height="120" style="display: block; border: 0px;" />
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                          <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                              <p style="margin: 0;">We're excited to have you get started. First, you need to confirm your account. Just press the button below.</p>
                          </td>
                      </tr>
                      <tr>
                          <td bgcolor="#ffffff" align="left">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                  <tr>
                                      <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                          <table border="0" cellspacing="0" cellpadding="0">
                                              <tr>
                                                  <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${process.env.BASE_URL}/entrepreneurs/verify/${id}/${token.token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
                                              </tr>
                                          </table>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr> <!-- COPY -->
                      <tr>
                          <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
                          </td>
                      </tr> <!-- COPY -->
                      <tr>
                          <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                              <p style="margin: 0;"><a href="${process.env.BASE_URL}/entrepreneurs/verify/${id}/${token.token}" target="_blank" style="color: #FFA73B;">${process.env.BASE_URL}/entrepreneurs/verify/${id}/${token.token}</a></p>
                          </td>
                      </tr>
                      <tr>
                          <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                              <p style="margin: 0;">If you have any questions, just reply to this email—we're always happy to help out.</p>
                          </td>
                      </tr>
                      <tr>
                          <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                              <p style="margin: 0;">Cheers,<br>SpaceDev Team</p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                          <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                              <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                              <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                      <tr>
                          <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                              <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                          </td>
                      </tr>
                  </table>
              </td>
          </tr>
      </table>
       
        `;

      // send email
      let transporter = nodemailer.createTransport({
        service : 'gmail', 
        auth: {
          user: process.env.USER, // generated ethereal user
          pass: process.env.PASS, 
          // type: 'Oauth2',
          // user: process.env.USER, // generated ethereal user
          // clientId : process.env.CLIENT_ID, 
          // clientSecret : process.env.CLIENT_SECRET,
          // regreshToken : process.env.REFRESH_TOKEN, 
          // accessToken : process.env.accessToken
        },
        tls:{
          rejectUnauthorized : false 
        }
      });
        // send mail with defined transport object
    let info = transporter.sendMail({
      from: '"FireUp" <startup.plateform@gmail.com>', // sender address
      to: email, // list of receivers
      subject: "Account validation ", // Subject line
      text: "Hello world?", // plain text body
      html: mail, // html body
    });
    
    console.log("email has been sent")
    // create a company to the entrepreneur
      try{
        let company = new Company({
          entrepreneur: id,
          companyName: companyName,
          companyEmail: companyEmail,
          companyPhone: companyPhone,
          companyAddress: companyAddress,
          companyCity: companyCity,
          companyZip: companyZip,
          companyWebsite: companyWebsite,
          companySector: companySector,
          companyService: companyService,
          companySize: companySize,

        }).save().then(() => {
          console.log("company has been created")
        })
      }catch(err){
        console.log(err)
      }
      
    })

    

    res.status(201).json({
      _id: entrepreneur.id,
      username: entrepreneur.username,
      email: entrepreneur.email,
      token: generateToken(entrepreneur._id),
    })
  })


  if (!entrepreneur) {
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
      // update status 
      await Entrepreneur.updateOne({ _id: entrepreneur._id }, { status: 'online' })
    res.json({
      _id: entrepreneur.id,
      fullName: entrepreneur.firstname + ' ' + entrepreneur.lastname,
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

//verify token and return user data 
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET)
}

const getMe = asyncHandler(async (req, res) => {
  const token = req.headers.authorization.split(' ')[1]
  const decoded = verifyToken(token)
  const entrepreneur = await Entrepreneur.findById(decoded.id)
  if (!entrepreneur) {
    res.status(404).json({
      message: 'Entrepreneur not found'
    })
  } else {
    res.status(200).json(entrepreneur)
  }

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

//@desc update entrepreneur online status
//@route PUT /api/entrepreneurs/validate/:id
//@access Private
const changeStatus = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findByIdAndUpdate(req.params.id, {
    status: 'offline',
  })
  res.status(200).json(entrepreneur)
})

//@desc get entrepreneur by id
//@route GET /api/entrepreneurs/:id
//@access Private
const getEntrepreneurById = asyncHandler(async (req, res) => {
  const entrepreneur = await Entrepreneur.findById(req.params.id)

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
  getEntrepreneurById,
  changeStatus
}