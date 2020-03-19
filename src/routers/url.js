const express = require('express')
const shortId = require('short-id')

const router = new express.Router()
const SUrl = require('../models/shorturl') //SUrl = shortUrl
const auth = require('../middleware/auth')

router.get('/surl', auth, async (req, res) => {
    try {
        const shorturl = await SUrl.find({ })
        if (!shorturl) {
            return res.status(404).json({ message: "no database inform" })
        }
        // console.log(shorturl)
        res.status(200).json(shorturl)
    } catch (error) {
        console.log(error)
        res.status(500).json()
    }
})

router.get('/surl/:shorturl', async (req, res) => {
    const _id = req.params.shorturl

    try {
        const shorturl = await SUrl.findOne({ shortUrl: "/surl/" + _id })
        if (!shorturl) {
            return res.status(404).json({ message: "cant find this url" })
        }
        return res.redirect(shorturl.url_name)

    } catch (error) {
        res.status(500).json()
    }
})



router.post('/surl/submit', auth, async (req, res) => {
    const generateShortUrl = "/surl/" + shortId.generate()

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

router.patch('/surl/:shorturl', auth, async (req, res) => {// still modify
    const updates = Object.keys(req.body)
    const allowedUpdates = ['shortUrl']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).json({ message: "Invalid updates!" })
    }

    try {
        const url = await SUrl.findOne({ _id: req.params.shorturl, owner: req.user._id })

        if (!url) {
            return res.status(404).json({ message: "Can't find this url" })
        }

        updates.forEach((update) => url[update] = req.body[update])
        await url.save()
        res.json({ message: "Update Successful!" })
    } catch (error) {
        res.status(400).json({ message: error })
    }

})

router.delete('/surl/:shorturl', auth, async (req, res) => {
    try {
        const urlIndata = await SUrl.findOneAndDelete({ _id: req.params.shorturl, owner: req.user._id })

        if (!urlIndata) {
            return res.status(404).json({message:"delete fail"})
        }
        res.status(201).json({ message: "delete success" })
    } catch (e) {
        // console.log(e)
        res.status(500).json({ message: "delete failed" })
    }
})

module.exports = router