const asyncHandler = require('express-async-handler')
const Project= require('../models/ProjectModel')
const nodemailer = require("nodemailer");
const SendmailTransport = require('nodemailer/lib/sendmail-transport');
const schedule = require("node-schedule");



const getProjectsToApprove = asyncHandler(async (req , res) => {
  const projectsss = await Project.find({approved:"en attente"})


  res.status(200).json(projectsss)
})



const getProjectsToApproveBycontractorId = asyncHandler(async (req , res) => {
  const projectsss = await Project.find({approved:"en attente",contractor_id:req.params.id})

  
  res.status(200).json(projectsss)
})

const puppeteer = require('puppeteer');
const month = '09';
const year = '2020';



const scraping = asyncHandler(async (req , res) => {
  

  // const browser = await puppeteer.launch({headless: true});
  // const page = await browser.newPage();
  // await page.goto(`https://www.imdb.com/movies-coming-soon/${year}-${month}`);
  // const movies = await page.evaluate(() => {
  //   let movies = [];
  //   let elements = document.querySelectorAll('div.list_item');
  //   for (element of elements) {
  //     movies.push({
  //       img: element.querySelector('img.poster')?.src,
  //       title: element.querySelector('td.overview-top a')?.text.trim(),
  //       time: element.querySelector('p.cert-runtime-genre time')?.textContent,
  //       description: element.querySelector('div.outline')?.textContent.trim()
      

  //     })
  //     
  //   }
  //   return movies;
  // });
  // // console.log("scrapping");
  // console.log(movies);
  // await browser.close(); 
  // res.status(200).json(movies)


})

// get Project 
const getApprovedProjects = asyncHandler(async (req , res) => {
    const projects = await Project.find({approved:"valide"})
 
    
    res.status(200).json(projects)

    

})

const getApprovedProjectsByContractorId = asyncHandler(async (req , res) => {
  const projects = await Project.find({approved:"valide",contractor_id:req.params.id})

  
  res.status(200).json(projects)
})

const getRefusedProjects = asyncHandler(async (req , res) => {
  const projects = await Project.find({approved:"refuse"})

  
  res.status(200).json(projects)
})


const getRefusedProjectsByContractorId = asyncHandler(async (req , res) => {
  const projects = await Project.find({approved:"refuse",contractor_id:req.params.id})

  console.log(projects)
  res.status(200).json(projects)
})

//create Project
const SetProject = asyncHandler( async (req , res) => {
    if (!req.body.title) {
        res.status(400)
        throw new Error('Project can t be empty ')
      }
    

      const projectExists = await Project.find(req.body.title.value)

      if (!projectExists) {
        res.status(400)
        throw new Error('project with this title already exists')
      }
      
    const project = await Project.create({
        title: req.body.title,
        description: req.body.description,
        start_date: new Date() ,
        end_date: req.body.end_date,
        amount_to_collect: req.body.amount_to_collect, 
        collected_amount: req.body.collected_amount,
        likes: req.body.likes,
        images: req.body.images,
        state: req.body.state,
        offering_type: req.body.offering_type,
        contractor_id : req.body.contractor_id,
        category: req.body.category,
        price_per_share: req.body.price_per_share,
        place : req.body.place,
        email : req.body.email,
        appproved : false,

    })
    if(!project)
    {
            res.status(400)
            throw new Error('Invalid project data')
          
    }
    else

    
    res.status(200).json(project)
})

//update Project
const UpdateProject = asyncHandler(async (req , res) => {

    const project = await Project.findById(req.params.id)

  if (!project) {
    res.status(400)
    throw new Error('Project not found')
  }
  const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

    res.status(200).json(updatedProject)
})



const ApproveProject = asyncHandler(async (req , res) => {

  const project = await Project.findById(req.params.id)

if (!project) {
  res.status(400)
  throw new Error('Project not found')
}
const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
})


var raison_refus ="" 
if (req.body.approved == "refuse")
raison_refus=req.body.approvement_comment;


var title_project =project.title;

var mail_refus = `Hello dear user, thank you for trusting us. <br><br>However, we inform you that your project <a style="color:#FFA73B;">${title_project} </a> has not been approved by our teams.<br> <br> Here are the reasons for the refusal: <a style="color:#870000; " >${raison_refus} </a>.<br><br>Don’t worry you just need to update your project following our tips .`
var acceptation = `Hello dear user, thank you for trusting us. <br><br>We inform you that your project <a style="color:#FFA73B;">${title_project} </a> has been approved successfully by our teams.<br><br> Your project is officially visible on the platform and you can now receive investments .<br><br>Congratulations .`



var resultat =""
if (req.body.approved == "refuse")
resultat =mail_refus
else resultat = acceptation
//email 

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
                        <p style="margin: 0;">  ${resultat}  </p>
                    </td>
                </tr>
               
                <tr>
                  
                </tr> <!-- COPY -->
              
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
    pass : process.env.PASS, 
    
  },
  tls:{
    rejectUnauthorized : false 
  }
});

      // send mail with defined transport object
      let info = transporter.sendMail({
        from: '"FireUp" <startup.plateform@gmail.com>', // sender address
        to: project.email, // list of receivers
        subject: "Project Approvement ", // Subject line
        text: "Hello world?", // plain text body
        html: mail, // html body
      });


  res.status(200).json(updatedProject)
})

//delete Project 
const DeleteProject = asyncHandler(async (req , res) => {
   const project = await Project.findById(req.params.id)
    if (!project) {
      res.status(400)
      throw new Error('project not found')
    }

    await project.remove()
    res.status(200).json({id : req.params.id})
      


})


const findProjectById = asyncHandler ( async(req , res) => {

  const project = await Project.findById(req.params.id)

  if (!project) {
    res.status(400)
    throw new Error('project not found')
  }

  res.status(200).json(project)

  
})


const findProjectByContractorId = asyncHandler ( async(req , res) => {

  const project = await Project.find({contractor_id: req.params.id_contractor,approved:"valide"} )

  if (!project) {
    res.status(400)
    throw new Error('project not found')
  }

  res.status(200).json(project)

  
})


const getApprovedProjectsByCategorie = asyncHandler(async (req , res) => {
  const projects = await Project.find({approved:"valide",category : req.params.category})

  console.log(projects)
  res.status(200).json(projects)
})

const setProjectApproved = asyncHandler(async (req , res) => {

  const project = await Project.findById(req.params.id)

if (!project) {
  res.status(400)
  throw new Error('Project not found')
}
const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
  new: true,
})

  res.status(200).json(updatedProject)
})

const job = schedule.scheduleJob('0 1 * * *', function(fireDate){
  
});


const CheckStateOfProjectCompaign = asyncHandler(async (req , res) => {
  const projects = await Project.find({state:"in progress"})

  console.log(projects)
  
  res.status(200).json(projects)
})

module.exports = {
  scraping, CheckStateOfProjectCompaign, getApprovedProjectsByCategorie, getProjectsToApprove,getProjectsToApproveBycontractorId,getApprovedProjectsByContractorId,getRefusedProjectsByContractorId,ApproveProject,getApprovedProjects,getRefusedProjects, SetProject ,UpdateProject ,DeleteProject, findProjectById,findProjectByContractorId
}