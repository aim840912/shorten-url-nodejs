const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')

require('./db/mongoose')
const userRouter = require('./routers/user')
const urlRouter = require('./routers/url')

const app = express()


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

app.use(session({
    name: 'sessionID',
    secret: 'sessionsecret',
    saveUninitialized: false,
    resave: false,
    keys:['key1'],
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: expiryDate
    }
}))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})



app.use(userRouter)
app.use(urlRouter)


app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
});


module.exports = app