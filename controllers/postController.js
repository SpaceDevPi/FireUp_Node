const asyncHandler = require('express-async-handler')
const Post= require('../models/postModel')

// get Posts 
const getPosts = asyncHandler(async (req , res) => {
    const posts = await Post.find()
 
    console.log(posts)
    res.status(200).json(posts)
})
//create Post
const SetPost = asyncHandler( async (req , res) => {
    if (!req.body.title || !req.body.content   ) {
        res.status(400)
        throw new Error('Please fill everything ')
      }
    

      let aujourdhui = new Date()

      
    const post = await Post.create({
        id_project: req.body.id_project,
        title: req.body.title,
        content: req.body.content ,
        date: aujourdhui,
        images: req.body.images,
       
    })
    if(!post.title || !post.content  || !post.id_project )
    {
            res.status(400)
            throw new Error('Invalid post data')
          
    }
    else

    
    res.status(200).json(post)
})

//update post
const UpdatePost = asyncHandler(async (req , res) => {

    const post = await Post.findById(req.params.id)

  if (!post) {
    res.status(400)
    throw new Error('post not found')
  }
  const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  })

    res.status(200).json(updatedPost)
})

//delete post 
const DeletePost = asyncHandler(async (req , res) => {
  



   const post = await Post.findById(req.params.id)

    if (!post) {
      res.status(400)
      throw new Error('post not found')
    }

    await post.remove()
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


const findPostsByProjectsId = asyncHandler ( async(req , res) => {

  const post = await Post.find({id_project: req.params.id_project} )

  if (!post) {
    res.status(400)
    throw new Error('post not found')
  }

  res.status(200).json(post)

  
})
module.exports = {
    getPosts, SetPost ,UpdatePost ,DeletePost, findPostsByProjectsId
}