const asyncHandler = require('express-async-handler')
const ProjectLive= require('../models/ProjectLive')

// get ProjectLive 
const getProjectLive = asyncHandler(async (req , res) => {
    const projectLive = await ProjectLive.find()
 
    console.log(projectLive)
    res.status(200).json(projectLive)
})
//create ProjectLive
const SetProjectLive = asyncHandler( async (req , res) => {
  
    


      
    const projectLive= await ProjectLive.create({
        link: req.body.link,
        idproject: req.body.idproject,
        date: req.body.date ,
        state :req.body.state,
        contractor_id :req.body.contractor_id

    })
    if(!projectLive.link || !projectLive.idproject  || !projectLive.date )
    {
            res.status(400)
            throw new Error('Invalid post data')
          
    }
    else

    
    res.status(200).json(projectLive)
})

//update projectLive
const UpdateprojectLive = asyncHandler(async (req , res) => {

    const projectLive = await ProjectLive.findById(req.params.id)


  const updatedprojectLive = await ProjectLive.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

    res.status(200).json(updatedprojectLive)
})

//delete post 
const DeleteprojectLive = asyncHandler(async (req , res) => {
  



   const projectLive = await ProjectLive.findById(req.params.id)

    if (!projectLive) {
      res.status(400)
      throw new Error('post not found')
    }

    await projectLive.remove()
    res.status(200).json({id : req.params.id})
      


})


// const findProjectById = asyncHandler ( async(req , res) => {

//   const project = await Project.findById(req.params.id)

//   if (!project) {
//     res.status(400)
//     throw new Error('project not found')
//   }

//   res.status(200).json(project)

  
// })


const getProjectsLiveByContractorId = asyncHandler(async (req , res) => {
  const projects = await ProjectLive.find({contractor_id:req.params.id})

  
  res.status(200).json(projects)
})

const findprojectLiveByProjectsId = asyncHandler ( async(req , res) => {

  const projectLive = await ProjectLive.find({idproject:req.params.id})


  res.status(200).json(projectLive)

  
})
module.exports = {
  getProjectsLiveByContractorId,  getProjectLive, SetProjectLive ,UpdateprojectLive ,DeleteprojectLive, findprojectLiveByProjectsId
}