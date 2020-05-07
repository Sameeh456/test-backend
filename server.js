const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv/config')

const app = express()

const saveRoutes = require('./routes/save')
const authRoutes = require('./routes/auth')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, PUT, POST, DELETE, PATCH, OPTIONS'
    )
    next()
})

app.use('/signup', authRoutes)
app.use('/login', authRoutes)
app.use('/save', saveRoutes)


app.use((error, req, res, next) => {
    console.log(error)
    const status = error.statusCode || 500
    const message = error.message
    const data = error.data
    res.status(status).json({ message: message, data: data })
})

mongoose
    .connect(process.env.DB_CONNECTION, { useUnifiedTopology: true }, () =>
        console.log('Connected to DB')
    )
    .then((result) => {
        app.listen(8080)
    })
    .catch((err) => {
        console.log(err)
    })

mongoose.set('useFindAndModify', false);