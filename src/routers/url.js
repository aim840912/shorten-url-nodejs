const express = require('express')
const shortId = require('short-id')

const router = new express.Router()
const SUrl = require('../models/shorturl') //SUrl = shortUrl
const auth = require('../middleware/auth')

router.get('/shortUrl', auth, async(req, res) => {
    try {
    
    
    } catch (error) {
        console.log(error)
        res.status(500).json()
    }
})

router.get('/shortUrl/:shorturl', async (req, res) => {
    const _id = req.params.shorturl

    try {
        const shorturl = await SUrl.findOne({ shortUrl: "/shorturl/" + _id })
        if (!shorturl) {
            return res.status(404).json({ message: "cant find this url" })
        }
        return res.redirect(shorturl.url_name)

    } catch (error) {
        res.status(500).json()
    }
})



router.post('/shortUrl/submit', auth, async (req, res) => {
    const generateShortUrl = "/shorturl/" + shortId.generate()

    const existURL = await SUrl.findOne({ url_name: req.body.url })
    if (existURL) {
        return res.json({ message: "URL is already exist", existURL })
    }

    const url = new SUrl({
        url_name: req.body.url,
        owner: req.user._id,
        shortUrl: generateShortUrl
    })

    try {
        await url.save()
        res.status(201).json({ message: "transfer success" })


    } catch (error) {
        res.status(400).json(error)
    }
})

router.patch('/shortUrl/:shorturl', auth, async (req, res) => {

})

router.delete('/shortUrl/:shorturl', auth, async (req, res) => {
    try {
        const shorturl = await SUrl.findOneAndDelete({ shortUrl: req.params.shorturl, owner: req.user._id })

        if (!shorturl) {
            res.status(404).json({ message: "delete fail" })
        }
        res.json({ message: "delete success" })
    } catch (e) {
        res.status(500).json({ message: "delete failed" })
    }
})

module.exports = router