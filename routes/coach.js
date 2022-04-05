
var express = require('express');
var router = express.Router();
var Coach = require('../models/coach')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs')
const multer = require('multer');
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const nodemailer = require("nodemailer");



router.get('/', async (req, res, next) => {
  // await sendEmail("fourat.anane@esprit.tn", "Verify Email", "ada");

    Coach.find(
          (err, Coachs) => { res.send(Coachs) }
        );
  });

  router.get('/getalltokens', async (req, res, next) => {
    // await sendEmail("fourat.anane@esprit.tn", "Verify Email", "ada");
  
      Token.find(
            (err, Tokens) => { res.send(Tokens) }
          );
    });
  // router.post('/upload', (req, res) => {
  //   if (req.files === null) {
  //     return res.status(400).json({ msg: 'No file uploaded' });
  //   }
  
  //   const file = req.files.file;
  
  //   file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
  //     if (err) {
  //       console.error(err);
  //       return res.status(500).send(err);
  //     }
  
  //     res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  //   });
  // });
  router.post('/login', async (req, res)=> {

    const coach = await Coach.findOne({
     
      Email: req.body.email,
    })
    if (!coach) {
			return res.status(401).send({ message: "Invalid Email or Password" , coach: false});
    }
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      coach.Password
    )
    if (!isPasswordValid) 
			return res.status(401).send({ message: "Invalid Email or Password" , coach: false});

    if (!coach.verified) {
			let token = await Token.findOne({ userId: coach._id });
			if (!token) {
				token = await new Token({
					userId: coach._id,
					token: crypto.randomBytes(32).toString("hex"),
				}).save();
        const url =  `http://localhost:3022/coach/${coach._id}/verify/${token.token}`;
        await sendEmail(coach.Email, "Verify Email", url);
			}

			return res
				.status(400)
				.send({ message: "An Email sent to your account please verify" });
		}
    

      const token = jwt.sign(
        {
          firstname: coach.FirstName,
          lastname:coach.Lastname,
          email: coach.Email,
          id:coach._id,
          image:coach.image,
        },
        'secret123'
      )
  console.log("madeit")
      return res.json({ status: 'ok', coach: token })
   

  })

  router.post('/add', async (req, res) => {
    try {
      console.log("d1")

      const userExists = await Coach.findOne({ Email :req.body.Email })
    if (userExists) return res.status(400).json({ error: "Email already exit" });
      const newPassword = await bcrypt.hash(req.body.password, 10)
      

      const coach = await new Coach({
        FirstName: req.body.FirstName,
        Lastname: req.body.Lastname,
        Adress: req.body.Adress,
        Email :req.body.Email,
        Dateofbirth: req.body.Dateofbirth,
        Password:newPassword,
        image:req.body.image,
        CV:req.body.CV,
        Number:req.body.Number,
      }).save();
      console.log("d2")

      const token = await new Token({
        userId: coach._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      console.log("d3")

      // const url = `${process.env.BASE_URL}coach/${userExists._id}/verify/${token.token}`;

      const url =  `http://localhost:3022/coach/${coach._id}/verify/${token.token}`;

      console.log(url);
      console.log("aaaa")
      await sendEmail(coach.Email, "Verify Email", url);
      console.log("aaaadadsda")

      res
        .status(201)
        .send({ message: "An Email sent to your account please verify" });
      
      } catch (err) {
      res.json({ status: 'error', error: 'Internal Server Error' })
    }
 
  });
  
  router.post('/addtest', async (req, res)=> {
    console.log("add");
    console.log(req.body);
    console.log("######");
    try{

    
  const coach = await Coach.create({
    FirstName: req.body.FirstName,
    Lastname: req.body.FirstName,
    Adress: req.body.Adress,
    Email :req.body.Email,
    Date: req.body.Date,
    Password:req.body.Password,
    image:req.body.image,
    Cv:req.body.Cv,
  })
  res.send(coach);
}catch(err){}
res.json({status:'ok'})
  });

  router.get("/:id/verify/:token/", async (req, res) => {
    try {
      console.log("aaa1")
      const user = await Coach.findOne({ _id: req.params.id });
      if (!user) return res.status(400).send({ message: "Invalid link" });
      console.log("aaa221")

      const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
      });
      console.log("aaa33")

      if (!token) return res.status(400).send({ message: "Invalid link" });
     
      await Coach.updateOne( {_id: user._id}, {$set : { verified: true}} );
      // await token.remove();
      console.log("aaa444")

      res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
      console.log(error)
      res.status(500).send({ message: "Internal Server Error" });
    }
    
  });
  
  router.get('/addform', function (req, res, next) {
  
    res.render('add.twig', { title: "Add contact" });
  });
  

  
//   router.get('/edit/:id', function (req, res, next) {
  
//     Coach.findById(req.params.id,
//       (err, Coachs) => { res.render('edit.twig', { title: "Edit contact", cont: Coachs }); }
//     );
  
//   });
  
  router.post('/edit/:id', async  (req, res, next) => {
    console.log("edit");
    console.log(req.body);
    console.log("######");

    Coach.exists({ _id: req.params.id },
      (err, result) => { /*  */
        console.log("result " + result); /* res.json(contacts)  */
        console.log(result);
      
     
        if (result) {

          console.log("true");
          Coach.updateOne({ _id: req.params.id }, { $set: req.body }, (err, data) => {
            console.log(data);
            // res.redirect('/contact');
            res.json(" : Contact :" + Coach._id + " updated"); 

          });
          // res.json(result)
        } else {
          console.log("false");
          res.json(result)
  
        }
  
      }
    );
  
  });

  router.post('/edit2/:id', async  (req, res, next) => {
    try {
      const coach = await Coach.findOne({
     
        _id: req.params.id,
      })
      console.log(coach)

      const isPasswordValid = await   bcrypt.compare(
        req.body.oldpassword,
        coach.Password
      )
      if (!isPasswordValid) return res.status(400).json({ error: "password already exist" });

      const newPassword = await bcrypt.hash(req.body.Password, 10)

      await Coach.updateOne(
        { _id: req.params.id },
        { $set: { Password: newPassword,image: req.body.image } }
      )
  
      return res.json({ status: 'ok' })
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
    
   
  
  });



  
  router.get('/delete/:id', function (req, res, next) {
    Coach.findByIdAndDelete(req.params.id,
      (err, data) => {
        console.log(data);
        /* return res.status(200).send("deleted").end(); */
        // res.redirect('/contact');
        res.json(" : Contact  deleted"); 

      }
    );
  });
  

  
  router.get('/find/:id', function (req, res, next) {
    Coach.findById(req.params.id,
      (err, Coachs) => { res.json(Coachs); }
    );
  });






  router.get('/getcoachjwt', async (req, res) => {
    const token = req.headers['x-access-token']
  
    try {
      const decoded = jwt.verify(token, 'secret123')
      const email = decoded.email
      const coach = await Coach.findOne({ Email: email })
  
      return res.json({ status: 'ok', fullname: coach.FirstName +' '+ coach.Lastname , id:coach.id,image:coach.image })
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
  })
  
  router.post('/postcoachapi', async (req, res) => {
    const token = req.headers['x-access-token']
  
    try {
      const decoded = jwt.verify(token, 'secret123')
      const email = decoded.email
      await Coach.updateOne(
        { email: email },
        { $set: { quote: req.body.quote } }
      )
  
      return res.json({ status: 'ok' })
    } catch (error) {
      console.log(error)
      res.json({ status: 'error', error: 'invalid token' })
    }
  })

  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}`)
        // cb(null, ${Date.now()}_${file.originalname})
  
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