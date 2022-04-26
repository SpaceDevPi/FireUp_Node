
var express = require('express');
var router = express.Router();
var Offerticket = require('../models/offerticket')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
var sid ="AC7c74f112a40f61397839db1c3d2fc72b";
var auth_token = "2520b5d46dce335023e95ce194eb4793"
 var twilio = require('twilio')(process.env.sid,process.env.auth_token)
// var twilio = require('twilio')(sid,auth_token)
// const connectDB = require('../config/db');
const sendEmail = require("../utils/sendEmail");

router.get('/',  async (req, res, next) => {
 
  
  // twilio.messages.create({
  //   from :"+12344071581",
  //   to:"+21626868706",
  //   body:"Offer reservation done successfully!"
  // }).then((res)=>console.log('worked')).catch((err)=>{console.log(err);});
  var dateTime = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

  console.log(dateTime.toLocaleDateString('EN-EN', options))
  Offerticket.find(
          (err, Offers) => { res.send(Offers) }
        );
  });
  // router.get('/gethours/:date', function(req, res) {
  //   //get data from the request
  //     var data = {
  //         date: req.params.date
  //     };
  //     function fetchID(data, callback) {
  //       connectDB.query('SELECT timeoffer FROM offerticket WHERE date = ?',        
  //                data.date, function(err, rows) {
  //             if (err) {
  //                 callback(err, null);
  //             } else 
  //                 callback(null, rows[0].id);
  //         });
  //     }
  //     var user_id;
  //     fetchID(data, function(err, content) {
  //         if (err) {
  //         console.log(err);
  //         res.send(err);  
  //         // Do something with your error...
  //         } else {
  //         user_id = content;
  //         console.log(user_id);
  //         res.send("user id is -" + user_id);
  //         }
  //     });
  // })
  
  router.post('/add', async (req, res) => {
    // twilio.messages.create({
    //   from :"+12344071581",
    //   to:"+21626868706",
    //   body:"Offer reservation done successfully! The meeting is scheduled with coach : "+req.body.coachfullname+ " for "+req.body.dateoffer+" , "+req.body.timeoffer+" in room number :"+req.body.numroom
    // }).then((res)=>console.log('worked')).catch((err)=>{console.log(err);});
    try {
      await Offerticket.create({
        idcoach:req.body.idcoach,
        idoffer:req.body.idoffer,
        idclient:req.body.idclient,
        numroom:req.body.numroom,
        dateoffer:req.body.dateoffer,
        timeoffer:req.body.timeoffer,
        image:req.body.image,
        coachfullname:req.body.coachfullname,
        clientfullname:req.body.clientfullname,
      })
      res.json({ status: 'ok' })
    } catch (err) {
      res.json({ status: 'error', error: 'Duplicate emailll' })
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
            console.log(err)
            // res.redirect('/contact');
            res.json(" : Contact :" + Offerticket._id + " updated"); 

          });
          // res.json(result)
        } else {
          console.log("false");
          res.json(result)
          
  
        }
  
      }
    );
  
  });
  
  router.get('/delete/:id', async (req, res, next)  => {
    Offerticket.findByIdAndDelete(req.params.id,
      (err, data) => {
    //         twilio.messages.create({
    //   from :"+12344071581",
    //   to:"+21626868706",
    //   body:"Dear "+data.clientfullname+ " I'm really sorry to inform you that the offer that you booked, which was scheduled on "+data.dateoffer+" , "+data.timeoffer+" , has been cancelled .   Please accept my apologies with regards to this unfortunate matter.    I appreciate your understanding.       Best Regards,     Coach  "+data.coachfullname
    // }).then((res)=>console.log('workedddd')).catch((err)=>{console.log(err);});
        console.log(data);
        const mail =`
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: 'Lato', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We're thrilled to have you here! Get ready to dive into your new account. </div>
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
            <!-- LOGO -->
            <tr>
                <td bgcolor="#FFA73B" align="center">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td align="center" valign="top" style="padding: 40px 10px 40px 10px;"> </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#FFA73B" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                                <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Dear <span style=" color :#FFA73B;">` + data.clientfullname + `</span></h1> <img src=" https://img.icons8.com/clouds/100/000000/sad.png" width="125" height="120" style="display: block; border: 0px;" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 40px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <p style="margin: 0;">I'm really sorry to inform you that the offer that you booked, which was scheduled on ` + data.dateoffer + ` on hour ` + data.timeoffer + ` , has been cancelled . </p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td bgcolor="#ffffff" align="center" style="padding: 20px 30px 60px 30px;">
                                            <table border="0" cellspacing="0" cellpadding="0">
                                                <tr>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr> <!-- COPY -->
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 0px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <p style="margin: 0;">Please accept my apologies with regards to this unfortunate matter.</p>
                            </td>
                        </tr> <!-- COPY -->
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                            <p style="margin: 0;">I regret any inconvenience this may cause you, even though I've tried my best to inform everyone as soon as possible.</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <p style="margin: 0;">I appreciate your understanding.
                                .</p>
                            </td>
                        </tr>
                        <tr>
                            <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <p style="margin: 0;">Best Regards,<br>Coach ` + data.coachfullname + `</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#FFECD1" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">
                                <h2 style="font-size: 20px; font-weight: 400; color: #111111; margin: 0;">Need more help?</h2>
                                <p style="margin: 0;"><a href="#" target="_blank" style="color: #FFA73B;">We&rsquo;re here to help you out</a></p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                        <tr>
                            <td bgcolor="#f4f4f4" align="left" style="padding: 0px 30px 30px 30px; color: #666666; font-family: 'Lato', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 400; line-height: 18px;"> <br>
                                <p style="margin: 0;">If these emails get annoying, please feel free to <a href="#" target="_blank" style="color: #111111; font-weight: 700;">unsubscribe</a>.</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
         
          `;
         sendEmail("fourat.anane@esprit.tn", "offer deleted", "aaa",mail);
      
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

    router.get('/findallbyidoffer/:id', async (req, res) => {
   
      const offer = await Offerticket.find({ idoffer: req.params.id })

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