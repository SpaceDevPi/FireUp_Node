const asyncHandler = require('express-async-handler')
const { cookie } = require('express/lib/response')
const nodemailer = require("nodemailer");
const {google} = require ('googleapis');
const pdfDocument = require('pdfkit')
const fs = require('fs')
//const path = require('path');
//const multer = require('multer');
const Project= require('../models/ProjectModel')
const doc = new pdfDocument()
const Investement = require('../model/InvestementModel')
const Investor= require('../model/investorModel');
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const CLIENT_ID = ' 25280197858-rg21qimeeq5vb253phc88vvb7o6ttcil.apps.googleusercontent.com'
const CLIENT_SECRET ='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'
const REDIRECT_URI ='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN ='1//04uOUxzR7QGa4CgYIARAAGAQSNwF-L9IrXT9YL_36Tk_s01q5yYyAPvyhNNKdRZl_diQ9Sc8FPkrWeJOxLaLw61BT9mPAdXsaykk'
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
      const investor = await Investor.findById(req.body.idInvestisseur)


    

    const investement = await Investement.create(req.body)

    const project = await Project.findById(req.body.idProject); 
    if (project.montantRestant==-1){
        project.montantRestant = req.body.monatantTotal- req.body.montantInvesti; 
    }else{
      project.montantRestant = project.montantRestant -req.body.montantInvesti;
    }

    const updatedProject = await Project.findByIdAndUpdate(req.body.idProject,  project)
    //console.log(project.montantRestant)
    //const investor = await Investor.findById(req.params.idInvestisseur)
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
                        
    <h2  style="text-align: center; text-transform: uppercase;color: #f26716;"> Hello thanks for your Investment in our plateform <b>FireUp</b></h2>
    <h3>this the details of your investment</h3>
    <h4>You have a new investement in the project : ${investement.idProject}</h4>
    <h4>Methode d'investissement : ${investement.MethodeInvestissement} </h4>
    <h4>Montant : ${investement.montantInvesti}</h4>
    <h4>Date d'investissement : ${investement.dateInvestissement}</h4>
    <h4>Date de fin d'investissement : ${investement.dateFin} </h4>
    <h4>Montant total d'investissement : ${investement.monatantTotal} </h4>
                        </td>
                    </tr>
                    <tr>
                       
                    </tr> <!-- COPY -->
                                      
                    </table>
            </td>
        </tr>
    </table>   

    `
    const pdf =`

   Hello thanks for your Investment in our plateformFireUp

                    this the details of your investment:
    You have a new investement in the project : ${investement.idProject}
    Methode d'investissement : ${investement.MethodeInvestissement} 
    Montant : ${investement.montantInvesti}
    Date d'investissement : ${investement.dateInvestissement}
    Date de fin d'investissement : ${investement.dateFin} 
    Montant total d'investissement : ${investement.monatantTotal} 

    `
      // create reusable transporter object using the default SMTP transport
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

console.log(investor)
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"FireUp" <startup.plateform@gmail.com>', // sender address
    to: investor.email, // sender addresslist of receivers
    subject: "Investement", // Subject line
    text: "Hello world?", // plain text body
    html: mail, // html body
  });
  
  console.log("email has been sent")

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
 

  doc.pipe(fs.createWriteStream(`./files/${investement.idInvestisseur}.pdf`));

  doc.image('./files/img.png', {
    fit: [100, 50],
    align: 'start',
    valign: 'start'
  });

  doc
  .fontSize(12)
  .text(pdf,  100, 100 );
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




//get investement by project using
const getInvestmentsByProject = asyncHandler(async (req , res) => {
  const investements = await Investement.find({idProject : req.params.id})

  res.status(200).json(investements)
})



//get investement by Form investement 
const getInvestmentsByFormInvestement = asyncHandler(async (req , res) => {
  const investements = await Investement.find({MethodeInvestissement : req.params.formInvest})

  res.status(200).json(investements)
})



//get investement by project using
const getInvestmentsByInvestor = asyncHandler(async (req , res) => {
  const investements = await Investement.find({idInvestisseur : req.params.id})


    const projects = await Project.find(
      {id : investements.forEach(element=>{
         element.idProject
         console.log(element.idProject)
      })}
      )
    

  
  res.status(200).json(projects)
})

const getMontantTotalInvesti= asyncHandler ( async (req , res) => {
  const investements = await Investement.find(); 
  var totalInvest; 
  investements.forEach(investment => {
    totalInvest = totalInvest +investment.montantInvesti; 
  });
  console.log(totalInvest)
})



  module.exports = {
    getInvestments, DeleteInvestment ,getMontantTotalInvesti,SetInvestement , UpdateInbestement ,getInvestmentsByInvestor,getInvestmentsByFormInvestement, findInvestementById,getInvestmentsByProject
  }