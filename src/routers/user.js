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



module.exports = router