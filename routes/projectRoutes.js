const express = require ('express')
const {CheckStateOfProjectCompaign,scraping,getApprovedProjectsByCategorie,getProjectsToApproveBycontractorId,getApprovedProjectsByContractorId,getRefusedProjectsByContractorId, getApprovedProjects, findProjectById,ApproveProject,getProjectsToApprove,getRefusedProjects, SetProject, UpdateProject, DeleteProject ,findProjectByContractorId} = require('../controllers/projectController')
const router = express.Router()
const multer = require('multer');
const schedule = require("node-schedule");
const asyncHandler = require('express-async-handler')
const Project= require('../models/ProjectModel')
const puppeteer = require('puppeteer');
const month = '09';
const year = '2020';
const fs = require('fs');

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


const job =  schedule.scheduleJob(' 60 * * * * *', async function(fireDate){
    let currentDate = new Date();
    // console.log('Check State Of Project Compaign at ' + fireDate );
    var projects = await Project.updateMany({state:"in progress",end_date: { $gte: currentDate }}, { $set: { state: 'finished' }} )
 


    /***********/
    const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();
	await page.setDefaultNavigationTimeout(0);

	await page.goto(`https://www.startengine.com/explore`);
  const movies = await page.evaluate(() => {
    let movies = [];
    let elements = document.querySelectorAll('div.tombstone');
    for (element of elements) {
    if(movies.length <5) {  movies.push({
        desc: element.querySelector('span.search-result-tombstone')?.textContent.trim(),
              raised_money: element.querySelector('div.tombstone-stats .stat .num')?.textContent.trim(),
titlz: element.querySelector('h5.desc')?.textContent.trim(),
img: element.querySelector('div.tombstone-cover')?.textContent.trim(),       })}
      console.log(movies)
    }
		return movies;
	});
	console.log(movies);
	fs.writeFileSync('./uploads/scraping_data.json', JSON.stringify(movies));

	await browser.close();

}); 


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