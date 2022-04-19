const express = require ('express')
const router = express.Router()
const {ResetPassword,getInvestors,DeleteInvestor,verifyEmail, SetInvestor,UpdateInvestor , findInvestorById , loginInvestor} = require('../controllers/investorControllor')
const multer = require('multer');


router.get('/' , getInvestors)

router.get('/investorId/:id' ,findInvestorById )

router.post('/newInvestor' , SetInvestor)



router.put ('/ubdateInvestor/:id' , UpdateInvestor)

router.delete('/deleteInvestor/:id' , DeleteInvestor)

router.post('/loginInvestor' , loginInvestor)

router.post('/forgotPassword', ResetPassword)

router.get("/verify/:id/:token", verifyEmail);


var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/investor/')
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
        return res.json({ success: true, image: res.req.file.path, fileName: res.req.file.filename })
    })

});



module.exports = router