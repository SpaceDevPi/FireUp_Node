const express = require ('express')
const router = express.Router()
const {    getInvestments, DeleteInvestment ,SetInvestement , UpdateInbestement , findInvestementById } = require('../controllers/investementController'); 


router.get('/' , getInvestments)

router.get('/investmentId/:id' ,findInvestementById )

router.post('/newInvestment' , SetInvestement)


router.put ('/ubdateInvestment/:id' , UpdateInbestement)


router.delete('/deleteInvestment/:id' , DeleteInvestment)







module.exports = router