const jwt = require('jsonwebtoken')

const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token)
        const decoded = jwt.verify(token, "thisisasecretformyapp")
        console.log("decode success")
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user) {
            console.log("cant find user")
            throw new Error()
        }

        req.token = token
        req.user = user

        next()

    } catch (e) {
        res.status(401).json({ err: 'Please authenticate.' })
    }
}

module.exports = auth