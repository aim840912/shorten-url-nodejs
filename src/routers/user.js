const express = require('express')

const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

router.post('/user/signup', async (req, res) => {
    const user = new User(req.body)
    console.log("signup")
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).json({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
})

router.post('/user/login', async (req, res) => {
    console.log("login")
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.json({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).json()
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router