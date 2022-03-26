const express = require ('express')
const { getPosts, findPostsByProjectsId, SetPost, UpdatePost, DeletePost } = require('../controllers/postController')
const router = express.Router()



router.get('/' , getPosts)


router.get('/postByProjects/:id_project' ,findPostsByProjectsId )

router.post('/newpost' , SetPost)

router.put ('/updatepost/:id' , UpdatePost)


router.delete('/deletepost/:id' , DeletePost)

  





module.exports = router