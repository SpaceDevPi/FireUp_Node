const express = require('express');
const colors = require('colors');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const PORT = process.env.PORT || 5000;
var CoachRouter = require('./routes/coach');
var ArticleRouter = require('./routes/article');
var OfferRouter = require('./routes/offer');
var Offerticket = require('./routes/offerticket');
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/contractors', require('./routes/contractorRoutes'));
app.use('/api/entrepreneurs', require('./routes/entrepreneurRoutes'));
app.use('/api/companies', require('./routes/companyRoutes'));
app.use('/api/investors' , require('./routes/investorRoutes'))
app.use('/api/investement' , require('./routes/investementRoutes')) 
app.use('/api/project' , require('./routes/projectRoutes'))
app.use('/api/post' , require('./routes/postRoutes'))
app.use('/api/comments' , require('./routes/commentsRoutes'))
app.use('/uploads', express.static("uploads"));
app.use("/api/events", require("./routes/eventsRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use('/api/coach', CoachRouter);
app.use('/api/articles', ArticleRouter);
app.use('/api/offers', OfferRouter);
app.use('/api/offerticket', Offerticket);

app.use(errorHandler)

app.listen(PORT, () => {console.log('Server is running on port ' + PORT)});
