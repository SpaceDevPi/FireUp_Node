const asyncHandler = require('express-async-handler')
const Comments= require('../models/commentsModel')
const Filter = require('bad-words');
// get Comments 
const getComments = asyncHandler(async (req , res) => {
    const comments = await Comments.find()
 
    console.log(comments)
    res.status(200).json(comments)
})


const createComment = asyncHandler(async (text, parentId = null,req , res) => {

    const comments = await Comments.create({
        id_project: "1",
        id_user: "2",
        content: req.body.text ,
        date: new Date(),
        parentId ,
       
       
    })
    res.status(200).json(comments)


  })

//create comments
const SetComments = asyncHandler( async (req , res) => {
    if (!req.body.content || !req.body.id_user   ) {
        res.status(400)
        throw new Error('Please fill everything ')
      }
    

      let aujourdhui = new Date()

     var filter = new Filter()
        filter.addWords("salut")

    const comments = await Comments.create({
        id_project: req.params.id_project,
        id_user: req.body.id_user,
        content:req.body.content,
        date: aujourdhui,
        parentId:req.body.parentId ,
       
       
    })
    //filter.clean(req.body.content)


    if(!comments.id_user ||!comments.content  || !comments.id_project )
    {    

            res.status(400)
            // console.log('bad words')
            throw new Error('Invalid comment data')
            
              }

    else {
      console.log('comment published' +comments.content )

      if(filter.isProfane(comments.content) )
      console.log('bad words')
      
      comments.content = filter.clean(req.body.content)

      res.status(200).json(comments)
      console.log('comment published' +comments.content )

    }
})

//update comments
const UpdateComments = asyncHandler(async (req , res) => {

    const comments = await Comments.findById(req.params.id)

  if (!comments) {
    res.status(400)
    throw new Error('comments not found')
  }
  const updatedComments = await Comments.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

    res.status(200).json(updatedComments)
})

//delete Comments 
const DeleteComments = asyncHandler(async (req , res) => {
  



   const comments = await Comments.findById(req.params.id)

    if (!comments) {
      res.status(400)
      throw new Error('comments not found')
    }

    await comments.remove()
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


const getCommentsByProjectsId = asyncHandler ( async(req , res) => {

  const comments = await Comments.find({id_project: req.params.id_project} )

  if (!comments) {
    res.status(400)
    throw new Error('Comments not found')
  }

  res.status(200).json(comments)

  
})

const getCommentsWithNullParentId = asyncHandler ( async(req , res) => {

  const comments = await Comments.find({parentId: "null"} )

  if (!comments) {
    res.status(400)
    throw new Error('Comments not found')
  }

  res.status(200).json(comments)

  
})
module.exports = {
    getCommentsByProjectsId, SetComments ,UpdateComments ,DeleteComments,createComment ,getComments ,getCommentsWithNullParentId
}