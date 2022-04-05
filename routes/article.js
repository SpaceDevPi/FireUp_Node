
var express = require('express');
var router = express.Router();
var Article = require('../models/article')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const multer = require('multer');

router.get('/', function (req, res, next) {
 
  var dateTime = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  console.log(dateTime.toLocaleDateString('EN-EN', options))
    Article.find(
          (err, Articles) => { res.send(Articles) }
        );
  });
  
  
  router.post('/add', async (req, res) => {
    
    try {
      await Article.create({
        Title: req.body.Title,
        Description: req.body.Description,
        Likes: req.body.Likes,
        Image : req.body.Image,
        coachfullname: req.body.coachfullname,
        Category: req.body.Category,
        coachid:req.body.coachid,
        coachimage:req.body.coachimage,
      })
      res.json({ status: 'ok' })
    } catch (err) {
      res.json({ status: 'error', error: 'Duplicate email' })
    }
 
  });
  
  


  

  
//   router.get('/edit/:id', function (req, res, next) {
  
//     Coach.findById(req.params.id,
//       (err, Coachs) => { res.render('edit.twig', { title: "Edit contact", cont: Coachs }); }
//     );
  
//   });
  
  router.post('/edit/:id', function (req, res, next) {
    console.log("edit");
    console.log(req.body);
    console.log("######");
  
    Article.exists({ _id: req.params.id },
      (err, result) => { /*  */
        console.log("result " + result); /* res.json(contacts)  */
        console.log(result);
  
        if (result) {
          console.log("true");
          Article.updateOne({ _id: req.params.id }, { $set: req.body }, (err, data) => {
            console.log(data);
            // res.redirect('/contact');
            res.json(" : Contact :" + Article._id + " updated"); 

          });
          // res.json(result)
        } else {
          console.log("false");
          res.json(result)
  
        }
  
      }
    );
  
  });
  
  router.get('/delete/:id', function (req, res, next) {
    Article.findByIdAndDelete(req.params.id,
      (err, data) => {
        console.log(data);
        /* return res.status(200).send("deleted").end(); */
        // res.redirect('/contact');
        res.json(" : Contact  deleted"); 

      }
    );
  });
  router.get('/findallbyid/:id', async (req, res) => {
   
      const article = await Article.find({ coachid: req.params.id })

      res.send(article);
    });
    
  router.get('/find/:id', function (req, res, next) {
    Article.findById(req.params.id,
      (err, Coachs) => { res.json(Coachs); }
    );
  });
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        // cb(null, `${file.originalname}`)
        cb(null, `${Date.now()}_${file.originalname}`)

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
  
  
  module.exports = router;