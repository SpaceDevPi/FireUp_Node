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
    <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">

    <img src="./files/img.png" />
    <h2  style="text-align: center; text-transform: uppercase;color: #f26716;"> Hello thanks for your Investment in our plateform <b>FireUp</b></h2>
    <h3>this the details of your investment</h3>
    <h4>You have a new investement in the project : ${investement.idProject}</h4>
    <h4>Methode d'investissement : ${investement.MethodeInvestissement} </h4>
    <h4>Montant : ${investement.montantInvesti}</h4>
    <h4>Date d'investissement : ${investement.dateInvestissement}</h4>
    <h4>Date de fin d'investissement : ${investement.dateFin} </h4>
    <h4>Montant total d'investissement : ${investement.monatantTotal} </h4>
    </div>

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
      const accessToken = 'ya29.A0ARrdaM8CcjMkp6lEX09oop0fd95RlIf0b57sxNu14MhItiNH3oi_1KjdymVqOlqZwhcbHPhzHGQKvf97rhqOXInkDp0VfMbUBxERv7KoDkFb3s3O5opimzu4ZC2ay3NEbnfsdS7aKP8P6zEHPhy6apjjoXiXDQ'
  let transporter = await nodemailer.createTransport({
    service : 'gmail', 
    auth: {
      type: 'Oauth2',
      user: 'startup.plateform@gmail.com', // generated ethereal user
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
    from: '"Daami adem" <startup.plateform@gmail.com>', // sender address
    to: "daamiadem03@gmail.com", // list of receivers
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



  module.exports = {
    getInvestments, DeleteInvestment ,SetInvestement , UpdateInbestement ,getInvestmentsByInvestor,getInvestmentsByFormInvestement, findInvestementById,getInvestmentsByProject
  }