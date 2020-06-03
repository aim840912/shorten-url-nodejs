/* eslint-disable no-return-assign */
const express = require('express')
const shortId = require('short-id')

const router = new express.Router()
const ReUrl = require('../models/reurl')
const auth = require('../middleware/auth')

router.get('/reurl', auth, async (req, res) => {
  try {
    const shorturl = await ReUrl.find({ owner: req.user._id })
    if (!shorturl) {
      return res.status(404).json({ message: 'no database inform' })
    }
    return res.status(200).json(shorturl)
  } catch (error) {
    return res.status(500).json()
  }
})

router.get('/reurl/:shorturl', async (req, res) => {
  const _id = req.params.shorturl
  try {
    const shorturl = await ReUrl.findOne({ shortUrl: `/reurl/${_id}` })
    if (!shorturl) {
      return res.status(404).json({ message: 'cant find this url' })
    }
    return res.redirect(shorturl.url_name)
  } catch (error) {
    return res.status(500).json()
  }
})

router.get('/reurl/patch/:shorturl', async (req, res) => {
  const _id = req.params.shorturl
  try {
    const shorturl = await ReUrl.findOne({ _id })
    if (!shorturl) {
      return res.status(404).json({ message: 'cant find this url' })
    }
    return res.json(shorturl)
  } catch (error) {
    return res.status(500).json()
  }
})

router.post('/reurl/submit', auth, async (req, res) => {
  const generateShortUrl = `/reurl/${shortId.generate()}`

  const existURL = await ReUrl.findOne({ url_name: req.body.url })
  if (existURL) {
    return res.json({ message: 'URL is already exist', existURL })
  }

  const url = new ReUrl({
    url_name: req.body.url,
    owner: req.user._id,
    shortUrl: generateShortUrl
  })

  try {
    await url.save()
    return res.status(201).json({ message: 'transfer success' })
  } catch (error) {
    return res.status(400).json(error)
  }
})

router.patch('/reurl/:shorturl', auth, async (req, res) => {
  // still modify
  const updates = Object.keys(req.body)
  const allowedUpdates = ['url_name']
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  )

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates!' })
  }

  try {
    const url = await ReUrl.findOne({
      _id: req.params.shorturl,
      owner: req.user._id
    })
    if (!url) {
      return res.status(404).json({ message: "Can't find this url" })
    }

    updates.forEach(update => (url[update] = req.body[update]))
    await url.save()
    return res.json({ message: 'Update Successful!' })
  } catch (error) {
    return res.status(400).json({ message: error })
  }
})

router.delete('/reurl/:shorturl', auth, async (req, res) => {
  try {
    const urlIndata = await ReUrl.findOneAndDelete({
      _id: req.params.shorturl,
      owner: req.user._id
    })
    if (!urlIndata) {
      return res.status(404).json({ message: 'delete fail' })
    }
    return res.status(201).json({ message: 'delete success' })
  } catch (e) {
    return res.status(500).json({ message: 'delete failed' })
  }
})

module.exports = router
