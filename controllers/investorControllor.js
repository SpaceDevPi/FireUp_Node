const asyncHandler = require('express-async-handler')
const Investor= require('../model/investorModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const {google} = require ('googleapis')
const TokenInvestor = require('../model/investorToken');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const CLIENT_ID = '1038694018186-j755gahor1ug0frbtpm8i9ljp9h7jn5n.apps.googleusercontent.com'
const CLIENT_SECRET ='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'
const REDIRECT_URI ='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN ='1//04v3fgEtVe0ODCgYIARAAGAQSNgF-L9Irfu_1sm9vqBabnnT6W-o--xaz_ebpadEBIBhvfh0QjoPij9KAWC-1HNLG_3nElBLNiw'
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN})



// get investors 
const getInvestors = asyncHandler(async (req , res) => {
    const investors = await Investor.find()
    res.status(200).json(investors)
})
//create investor
const SetInvestor = asyncHandler( async (req , res) => {
    if (!req.body.username|| !req.body.email || !req.body.password) {
        res.status(400)
        throw new Error('investor can t be empty ')
      }

    const investorExists = await Investor.findOne((req.body.email).value)

    if (!investorExists) {
      res.status(400)
      throw new Error('User already exists')
    }

    if((req.body.password).length < 6){
      return res.status(400).json({
        msg: "password must be at least 6 charecters "
      })
    }
    
      // Hash password

    const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  req.body.password=hashedPassword

    const investor = await Investor.create(req.body)
    // const activation_token = createActivationToken(investor);

    // const createActivationToken = (payload) => {
    //   return jwt.sign(payload , process.env.ACTIVATION_TOKEN_SECRET , {expiresIn : '5m'});
    // }

    //verification mail
    let token = new TokenInvestor({
      investorId: investor._id.toString(),
      token: generateToken(investor._id),
    }).save().then(token => {
      console.log(token)
      const id = investor._id.toString()
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
                                                  <td align="center" style="border-radius: 3px;" bgcolor="#FFA73B"><a href="${process.env.BASE_URL}/investors/verify/${id}/${token.token}" target="_blank" style="font-size: 20px; font-family: Helvetica, Arial, sans-serif; color: #ffffff; text-decoration: none; color: #ffffff; text-decoration: none; padding: 15px 25px; border-radius: 2px; border: 1px solid #FFA73B; display: inline-block;">Confirm Account</a></td>
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
                              <p style="margin: 0;"><a href="${process.env.BASE_URL}/investors/verify/${id}/${token.token}" target="_blank" style="color: #FFA73B;">${process.env.BASE_URL}/investors/verify/${id}/${token.token}</a></p>
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
      to: req.body.email, // list of receivers
      subject: "Account validation ", // Subject line
      text: "Hello world?", // plain text body
      html: mail, // html body
    });
    
    console.log("email has been sent")
    
      
    })

    if (investor) {
      res.status(201).json({
        _id: investor.id,
        username: investor.username,
        email: investor.email,
        token: generateToken(investor._id),
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }

    
    

    
   
})





// @desc    Verify email
// @route   GET /api/entrepreneurs/verify/:id/:token
// @access  Private
const verifyEmail = asyncHandler(async (req, res) => {
  const investor = await Investor.findById(req.params.id)
  if (!investor) {
    res.status(400).send('Invalid link')
  }
  const token = await TokenInvestor.findOne({
    investorId: investor._id,
    token: req.params.token
  })
  if (!token) {
    res.status(400).send('Invalid link')
  }

  await Investor.updateOne({ _id: investor._id }, { valid: true })
  await TokenInvestor.deleteOne({ _id: token._id })

  res.send('Email verified successfully')

})


const loginInvestor = asyncHandler(async(req , res )=>{
  const { email, password } = req.body

  // Check for user email
  const investor = await Investor.findOne({ email })

  if (investor && (await bcrypt.compare(password, investor.password))) {
    res.json({
      _id: investor.id,
      name: investor.username,
      email: investor.email,
      token: generateToken(investor._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }

})


// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

//update investor
const UpdateInvestor = asyncHandler(async (req , res) => {

    const investor = await Investor.findById(req.params.id)

  if (!investor) {
    res.status(400)
    throw new Error('investor not found')
  }
  const updatedInvestor = await Investor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

    res.status(200).json(updatedInvestor)
})

//delete investor 
const DeleteInvestor = asyncHandler(async (req , res) => {
    const investor = await Investor.findById(req.params.id)

    if (!investor) {
      res.status(400)
      throw new Error('investor not found')
    }

    await investor.remove()
    res.status(200).json({id : req.params.id})
})


const findInvestorById = asyncHandler ( async(req , res) => {
  const investor = await Investor.findById(req.params.id)
  res.status(200).json(investor)
})

 // create reusable transporter object using the default SMTP transport
 
 

const ResetPassword =asyncHandler (async (req, res) => {
  const {id, password} = req.body
  const NewPassword =`

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
                      <h3>Reset password</h3>
                      <p>Your new password is :  ${password}</p>
                      </td>
                  </tr>
                  <tr>
                     
                  </tr> <!-- COPY -->
                                    
                  </table>
          </td>
      </tr>
  </table>     
      `
    
  
  try {
    const investorExist = await Investor.findById(req.body.id)

      if(!investorExist) return res.status(400).json({msg: "This email does not exist."})
      console.log(password)
      const passwordHash = await bcrypt.hash(password, 12)
      await Investor.findOneAndUpdate(req.body.id , {
        password: passwordHash
    })

    res.json({msg: "Password successfully changed!"})


      let transporter = await nodemailer.createTransport({
        service : 'gmail', 
        auth: {
          type: 'Oauth2',
          user: process.env.USER, // generated ethereal user
          clientId : CLIENT_ID, 
          clientSecret : CLIENT_SECRET,
          regreshToken : REFRESH_TOKEN, 
          accessToken : process.env.accessToken
        },
        tls:{
          rejectUnauthorized : false 
        }
      });
        // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"FireUp" <startup.plateform@gmail.com>', // sender address
      to: investorExist.email, // list of receivers
      subject: "NewPassword", // Subject line
      text: "Hello world?", // plain text body
      html: NewPassword, // html body
    });
    
    console.log("email has been sent")
      
 
      res.json({msg: "Re-send the password, please check your email."})
  } catch (err) {

  
  
  
  
      return res.status(500).json({msg: err.message})
  }
});


  module.exports = {
    getInvestors,verifyEmail, SetInvestor ,UpdateInvestor ,DeleteInvestor, findInvestorById , loginInvestor,ResetPassword
}