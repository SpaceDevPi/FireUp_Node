const express = require('express');
const colors = require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/contractors', require('./routes/contractorRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/investors' , require('./routes/investorRoutes'))
app.use('/api/investement' , require('./routes/investementRoutes')) 

app.use(errorHandler)

app.listen(PORT, () => {console.log('Server is running on port ' + PORT)});