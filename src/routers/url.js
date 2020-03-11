
const express = require('express')

const router = new express.Router()
const SUrl = require('../models/shorturl') //SUrl = shortUrl


router.get('/shortUrl', (req, res) => {

})


router.post('/shortUrl/submit', (req, res) => {
    console.log(req.body.url)


})

module.exports = router