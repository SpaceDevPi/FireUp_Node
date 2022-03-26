const express = require ('express')
const { getCommentsByProjectsId, getCommentsWithNullParentId,SetComments ,createComment,UpdateComments ,DeleteComments ,getComments } = require('../controllers/commentsController')
const router = express.Router()



router.get('/' , getComments)


router.get('/:id_project' ,getCommentsByProjectsId )

router.post('/newcomment/:id_project' , SetComments)

router.put ('/updatecomment/:id' , UpdateComments)

router.get('/parentIdNull' , getCommentsWithNullParentId)

router.delete('/deletecomment/:id' , DeleteComments
)


router.post('/newcomment2' , createComment)


  





module.exports = router