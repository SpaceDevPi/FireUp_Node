
var express = require('express');
var router = express.Router();
var Offerticket = require('../models/offerticket')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')

router.get('/', function (req, res, next) {
 
  var dateTime = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  console.log(dateTime.toLocaleDateString('EN-EN', options))
  Offerticket.find(
          (err, Offers) => { res.send(Offers) }
        );
  });
  
  
  router.post('/add', async (req, res) => {
    
    try {
      await Offerticket.create({
        idcoach:req.body.idcoach,
        idoffer:req.body.idoffer,
        idclient:req.body.idclient,
        numroom:req.body.numroom,
        dateend:req.body.dateend,
        datestart:req.body.datestart,
        image:req.body.image,
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
  
    Offerticket.exists({ _id: req.params.id },
      (err, result) => { /*  */
        console.log("result " + result); /* res.json(contacts)  */
        console.log(result);
  
        if (result) {
          console.log("true");
          Offerticket.updateOne({ _id: req.params.id }, { $set: req.body }, (err, data) => {
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
    Offerticket.findByIdAndDelete(req.params.id,
      (err, data) => {
        console.log(data);
        /* return res.status(200).send("deleted").end(); */
        // res.redirect('/contact');
        res.json(" : Contact  deleted"); 

      }
    );
  });
  router.get('/findallbyid/:id', async (req, res) => {
   
      const offer = await Offerticket.find({ idclient: req.params.id })

      res.send(offer);
    });
    router.get('/findallbyidforcoach/:id', async (req, res) => {
   
      const offer = await Offerticket.find({ idcoach: req.params.id })

      res.send(offer);
    });
  router.get('/findnbtotal/:id', async (req, res, next)=> {
    const offer = await Offerticket.find({ idclient: req.params.id })
    let sum = 0;
    for(property in offer){
      sum += offer[property];
    }
      res.send(sum);
  });

 

  
  module.exports = router;