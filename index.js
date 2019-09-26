const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const userRoutes = require('./routes/user')


const env = process.env.NODE_ENV || 'development';

if (env == 'development' || env == 'test') require('dotenv').config()

const configDb = {
  development: process.env.DBDEV,
  test: process.env.DBTEST,
  production: process.env.DBCONNECTION
}

mongoose
  .connect(configDb[env], {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
  })
  .then(() => console.log('Database connected'))
  .catch(err => console.log(err))


app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cors())
app.use(morgan('tiny'))

// Router Middleware
app.use('/api', userRoutes)


const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port} and run on ${env}`))