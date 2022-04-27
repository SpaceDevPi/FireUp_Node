const express = require ('express')
const {  getProjectsLiveByContractorId,  getProjectLive, SetProjectLive ,UpdateprojectLive ,DeleteprojectLive, findprojectLiveByProjectsId
} = require('../controllers/ProjectLiveController')
const router = express.Router()
const schedule = require("node-schedule");
const ProjectLive= require('../models/ProjectLive')



router.get('/' , getProjectLive)


router.get('/ProjectLiveByProjects/:id' ,findprojectLiveByProjectsId )

router.get('/ProjectLiveBycontractor/:id' ,getProjectsLiveByContractorId )


router.post('/newProjectLive' , SetProjectLive)

router.put ('/updateProjectLive/:id' , UpdateprojectLive)


router.delete('/deleteProjectLive/:id' , DeleteprojectLive)

  

const job =  schedule.scheduleJob(' 60 * * * * *', async function(fireDate){
    let currentDate = new Date();
    var projects = await ProjectLive.updateMany({state:"coming",date: { $gte: currentDate }}, { $set: { state: 'finished' }} )
 

}); 




module.exports = router