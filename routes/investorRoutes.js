const express = require ('express')
const router = express.Router()
const {ResetPassword,getInvestors,DeleteInvestor, SetInvestor,UpdateInvestor , findInvestorById , loginInvestor} = require('../controllers/investorControllor')

router.get('/' , getInvestors)

router.get('/investorId/:id' ,findInvestorById )

router.post('/newInvestor' , SetInvestor)


router.put ('/ubdateInvestor/:id' , UpdateInvestor)


router.delete('/deleteInvestor/:id' , DeleteInvestor)

router.post('/loginInvestor' , loginInvestor)

router.post('/forgotPassword', ResetPassword)







module.exports = router