const express = require ('express')
const router = express.Router()
const {    getInvestments, DeleteInvestment,getMontantTotalInvesti,getInvestmentsByFormInvestement, getInvestmentsByInvestor ,SetInvestement , UpdateInbestement , findInvestementById , getInvestmentsByProject} = require('../controllers/investementController'); 


router.get('/' , getInvestments)

router.get('/investmentId/:id' ,findInvestementById )

router.get('/getInvestmentsByProject/:id' ,getInvestmentsByProject )


router.get('/getInvestmentsByInvestor/:id' ,getInvestmentsByInvestor )

router.get('/getMontantTotalInvesti' , getMontantTotalInvesti)


router.get('/getInvestmentsByFormInvestement/:formInvest' ,getInvestmentsByFormInvestement )



router.post('/newInvestment' , SetInvestement)


router.put ('/ubdateInvestment/:id' , UpdateInbestement)


router.delete('/deleteInvestment/:id' , DeleteInvestment)







module.exports = router