
var express = require('express');
var router = express.Router();
var Offer = require('../models/offer')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

router.get('/', function (req, res, next) {
 
  var dateTime = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  console.log(dateTime.toLocaleDateString('EN-EN', options))
  Offer.find(
          (err, Offers) => { res.send(Offers) }
        );
  });
  
  
  router.post('/add', async (req, res) => {
    
    try {
      await Offer.create({
        idcoach:req.body.idcoach,
        type: req.body.type,
        title:  req.body.title,
        category :req.body.category,
        description: req.body.description,
        rating:req.body.rating,
        dateend:req.body.dateend,
        datestart:req.body.datestart,
        image:req.body.image,
        price:req.body.price,
        state:req.body.state,
        starttime:req.body.starttime,
        endtime:req.body.endtime,
        coachfullname:req.body.coachfullname,
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
  
    Offer.exists({ _id: req.params.id },
      (err, result) => { /*  */
        console.log("result " + result); /* res.json(contacts)  */
        console.log(result);
  
        if (result) {
          console.log("true");
          Offer.updateOne({ _id: req.params.id }, { $set: req.body }, (err, data) => {
            console.log(data);
            // res.redirect('/contact');
            res.json(" : Contact :" + Offer._id + " updated"); 

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
    Offer.findByIdAndDelete(req.params.id,
      (err, data) => {
        console.log(data);
        /* return res.status(200).send("deleted").end(); */
        // res.redirect('/contact');
        res.json(" : Contact  deleted"); 

      }
    );
  });
  router.get('/findallbyid/:id', async (req, res) => {
   
      const offer = await Offer.find({ idcoach: req.params.id })

      res.send(offer);
    });
    
  router.get('/find/:id', function (req, res, next) {
    Offer.findById(req.params.id,
      (err, Offers) => { res.json(Offers); }
    );
  });
  
  module.exports = router;