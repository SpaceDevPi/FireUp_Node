const express = require ('express')
const {getApprovedProjectsByCategorie,getProjectsToApproveBycontractorId,getApprovedProjectsByContractorId,getRefusedProjectsByContractorId, getApprovedProjects, findProjectById,ApproveProject,getProjectsToApprove,getRefusedProjects, SetProject, UpdateProject, DeleteProject ,findProjectByContractorId} = require('../controllers/projectController')
const router = express.Router()
const multer = require('multer');


router.get('/getProjectsToApproveBycontractorId/:id' , getProjectsToApproveBycontractorId)

router.get('/getApprovedProjectsByContractorId/:id' , getApprovedProjectsByContractorId)

router.get('/getRefusedProjectsByContractorId/:id' , getRefusedProjectsByContractorId)

router.get('/' , getApprovedProjects)

router.get('/getProjectsToApprove' , getProjectsToApprove)

router.get('/getRefusedProjects' , getRefusedProjects)

router.get('/project/:id' ,findProjectById )

router.get('/contractor-projects/:id_contractor' ,findProjectByContractorId )

router.post('/newproject' , SetProject)

router.put ('/updateproject/:id' , UpdateProject)

router.put ('/ApproveProject/:id' , ApproveProject)

router.delete('/deleteproject/:id' , DeleteProject)

router.get('/:category' , getApprovedProjectsByCategorie)
  


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
        // cb(null, `${Date.now()}_${file.originalname}`)

    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})

var upload = multer({ storage: storage }).single("file")

router.post("/uploadImage",  (req, res) => {

    upload(req, res, err => {
        if (err) {
            return res.json({ success: false, err })
        }
        return res.json({ success: true, images: res.req.file.path, fileName: res.req.file.filename })
    })

});

module.exports = router