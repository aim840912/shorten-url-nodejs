const express = require('express')
const shortId = require('short-id')

const router = new express.Router()
const SUrl = require('../models/shorturl') //SUrl = shortUrl
const auth = require('../middleware/auth')

router.get('/sh_url/:shorturl', async (req, res) => {
    const _id = req.params.shorturl

    try {
        const shorturl = await SUrl.findOne({ shortUrl: "/sh_url/" + _id })
        console.log(shortId)
        if (!shorturl) {
            return res.status(404).json({ message: "cant find this url" })
        }
        console.log(shorturl.url_name)
        return res.redirect(shorturl.url_name)

    } catch (error) {
        res.status(500).json()
    }

})

router.post('/shortUrl/submit', auth, async (req, res) => {
    // console.log(req.body.url)

    const url = new SUrl({
        url_name: req.body.url,
        owner: req.user._id,
        shortUrl: "/sh_url/" + shortId.generate()

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