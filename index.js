import express from "express";
import bodyParser from "body-parser";
const dotenv = require('dotenv');
const mongoose = require('mongoose');






const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());



app.get('/', (req, res) => { res.send('Hello World'); });

app.listen(PORT, () => {console.log('Server is running on port ' + PORT)});