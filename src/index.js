require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const passport = require('passport')

require('./db/mongoose')
const userRouter = require('./routers/user')
const urlRouter = require('./routers/url')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      secure: true,
      httpOnly: true
    }
  })
)

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  )
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.use(userRouter)
app.use(urlRouter)

// Initialize passport
app.use(passport.initialize())
// used for persistent login sessions
app.use(passport.session())

// include strategy configuration
require('./config/passport')(passport)

app.use((error, req, res) => {
  const status = error.statusCode || 500
  const { message } = error
  const { data } = error
  res.status(status).json({ message, data })
})
const { PORT } = process.env

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`)
})
