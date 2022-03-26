const express = require('express')
const dotenv = require('dotenv').config()
const colors = require('colors')
const cors = require('cors');    

const connectDB = require('./config/db')


const port = process.env.PORT || 5000

connectDB()
const app = express()
const {errorHandler} = require('./middleware/errorMiddleware')


app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cors());

app.use('/api/project' , require('./routes/projectRoutes'))
app.use('/api/post' , require('./routes/postRoutes'))
app.use('/api/comments' , require('./routes/commentsRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`server started on port ${port}`))


