const asyncHandler = require('express-async-handler')
const { cookie } = require('express/lib/response')
const nodemailer = require("nodemailer");
const {google} = require ('googleapis')
const pdfDocument = require('pdfkit')
const fs = require('fs')
const doc = new pdfDocument()



const Investement = require('../model/InvestementModel')
const Investor= require('../model/investorModel');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const CLIENT_ID = '1038694018186-j755gahor1ug0frbtpm8i9ljp9h7jn5n.apps.googleusercontent.com'
const CLIENT_SECRET ='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'
const REDIRECT_URI ='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN ='1//04v3fgEtVe0ODCgYIARAAGAQSNgF-L9Irfu_1sm9vqBabnnT6W-o--xaz_ebpadEBIBhvfh0QjoPij9KAWC-1HNLG_3nElBLNiw'
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI)
oAuth2Client.setCredentials({refresh_token : REFRESH_TOKEN})
//getInvestement
const getInvestments = asyncHandler(async (req , res) => {
    const investements = await Investement.find()
    res.status(200).json(investements)
})



//create investement
const SetInvestement = asyncHandler( async (req , res) => {
    if (!req.body.idProject|| !req.body.idInvestisseur || !req.body.idInvestisseur) {
        res.status(400)
        throw new Error('investement can t be empty ')
      }

      if (req.body.montantInvesti==0) {
        res.status(400)
        throw new Error('Erreur Montant')
      }


    

    const investement = await Investement.create(req.body)
    const investor = await Investor.findById(req.params.idInvestisseur)

    const mail =`
    <h2 style="color:#f26716;"> Hello thanks for your Investment in our plateform <b>FireUp</b></h2>
    <h3>this the details of your investment</h3>
    <h4>You have a new investement in the project : ${investement.idProject}</h4>
    <h4>Methode d'investissement : ${investement.MethodeInvestissement} </h4>
    <h4>Montant : ${investement.montantInvesti}</h4>
    <h4>Date d'investissement : ${investement.dateInvestissement}</h4>
    <h4>Date de fin d'investissement : ${investement.dateFin} </h4>
    <h4>Montant total d'investissement : ${investement.monatantTotal} </h4>

    `
    const pdf =`
     Hello thanks for your Investment in our plateform FireUp
    this the details of your investment
    You have a new investement in the project : ${investement.idProject}
    Methode d'investissement : ${investement.MethodeInvestissement} 
    Montant : ${investement.montantInvesti}
    Date d'investissement : ${investement.dateInvestissement}
    Date de fin d'investissement : ${investement.dateFin} 
    Montant total d'investissement : ${investement.monatantTotal} 

    `
      // create reusable transporter object using the default SMTP transport
      const accessToken = 'ya29.A0ARrdaM_gN5YEBS09452fWOsLDNUB6V8Zb9N64e6NvapoFXr5ADDNV9MJFRKaP8XkolEWbHKsTgJhhu9n4N457oh2l7KQ65SZwrcoLWijdzbMw0X2vEq9sEJ2ux--0yIARHuL8ifcOwMwUoY8HT-DU6gTuMFdBA'
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

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
 

  doc.pipe(fs.createWriteStream(`${investement.idInvestisseur}.pdf`));

  doc
  .fontSize(25)
  .text(pdf, 100, 100);
  doc.end();


    if (investement) {
      res.status(201).json({
        _id: investement.id,
        montantInvesti:investement.montantInvesti,
        MethodeInvestissement:investement.MethodeInvestissement,
        dateInvestissement:investement.dateInvestissement
        
      })
    } else {
      res.status(400)
      throw new Error('Invalid user data')
    }

    
    

    
   
})

//update Investement 
const UpdateInbestement = asyncHandler(async (req , res) => {

    const investement = await Investement.findById(req.params.id)

  if (!investement) {
    res.status(400)
    throw new Error('investment not found')
  }
  const updatedInvestement = await Investement.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

    res.status(200).json(updatedInvestement)
})

//delete investor 
const DeleteInvestment = asyncHandler(async (req , res) => {
    const investment = await Investement.findById(req.params.id)

    if (!investment) {
      res.status(400)
      throw new Error('investment not found')
    }

    await investment.remove()
    res.status(200).json({id : req.params.id})
})

const findInvestementById = asyncHandler ( async(req , res) => {
    const investment = await Investement.findById(req.params.id)
    res.status(200).json(investment)
  })

  module.exports = {
    getInvestments, DeleteInvestment ,SetInvestement , UpdateInbestement , findInvestementById
  }