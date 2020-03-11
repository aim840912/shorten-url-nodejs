
const express = require('express')

const router = new express.Router()
const SUrl = require('../models/shorturl') //SUrl = shortUrl
const auth=require('../middleware/auth')

router.get('/shortUrl', (req, res) => {

})


router.post('/shortUrl/submit',auth,async (req, res) => {
    console.log(req.body.url)

    const url = new SUrl({
        url_name:req.body.url,
        // owner: req.user._id
    })

    try {
        await url.save()
        res.status(201).json({ message: "Success save" })
    } catch (error) {
        console.log(error)
        res.status(400).json(error)
    }
})

module.exports = router