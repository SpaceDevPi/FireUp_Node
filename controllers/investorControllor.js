const asyncHandler = require('express-async-handler')
const Investor= require('../model/investorModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const nodemailer = require("nodemailer");
const {google} = require ('googleapis')

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
    
    
    const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)
  req.body.password=hashedPassword

    const investor = await Investor.create(req.body)
    // const activation_token = createActivationToken(investor);

    // const createActivationToken = (payload) => {
    //   return jwt.sign(payload , process.env.ACTIVATION_TOKEN_SECRET , {expiresIn : '5m'});
    // }


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
  const mail =`
      <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
      // <img src='files\img.png'/>

      <h2  style="text-align: center; color: #f26716;"> Hello thanks for your Investment in our plateform <b>FireUp</b></h2>
      <h3>Reset password</h3>
      <p>Your new password is ${password}</p>
      
      </div>
     
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


      const accessToken = 'ya29.A0ARrdaM8XcdnpgD84M1Wy_iOy3HTYBdW6oI5MsWQQC7Kh-oTzvr07Kv9LqrhKk0Ds8CUG_mIWNswsD83AE_dT3KyJrIpWVoNQrfNerbczrgYFb1HqiqpKTmJBpGCioy77yLoxPdXxzq_RhqMQwKQW-z1LuZgaHQ'
      let transporter = await nodemailer.createTransport({
        service : 'gmail', 
        auth: {
          type: 'Oauth2',
          user: 'daamiadem02@gmail.com', // generated ethereal user
          clientId : CLIENT_ID, 
          clientSecret : CLIENT_SECRET,
          regreshToken : REFRESH_TOKEN, 
          accessToken : accessToken
        },
        tls:{
          rejectUnauthorized : false 
        }
      });
        // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Daami adem" <daamiadem02@gmail.com>', // sender address
      to: "daamiadem03@gmail.com", // list of receivers
      subject: "Investement", // Subject line
      text: "Hello world?", // plain text body
      html: mail, // html body
    });
    
    console.log("email has been sent")
      
 
      res.json({msg: "Re-send the password, please check your email."})
  } catch (err) {

  
  
  
  
      return res.status(500).json({msg: err.message})
  }
});


  module.exports = {
    getInvestors, SetInvestor ,UpdateInvestor ,DeleteInvestor, findInvestorById , loginInvestor,ResetPassword
}