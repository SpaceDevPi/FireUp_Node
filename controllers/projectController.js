const asyncHandler = require('express-async-handler')
const Project= require('../models/ProjectModel')

// get Project 
const getProjects = asyncHandler(async (req , res) => {
    const projects = await Project.find()
 
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
        email : req.body.email

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

  const project = await Project.find({contractor_id: req.params.id_contractor} )

  if (!project) {
    res.status(400)
    throw new Error('project not found')
  }

  res.status(200).json(project)

  
})
module.exports = {
    getProjects, SetProject ,UpdateProject ,DeleteProject, findProjectById,findProjectByContractorId
}