const User = require('../models/user')

exports.postLogin = async (req, res) => {
  try {
    const user = await User.findByCredential(req.body.email, req.body.password)
    const token = await user.generateAuthToken()

    res.json({ user, token })
  } catch (e) {
    console.log(e)
    res.status(400).json()
  }
}

exports.postSignUp = async (req, res) => {
  const user = new User(req.body)
  console.log('signup')
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).json({ user, token })
  } catch (e) {
    console.log(e)
    res.status(400).json(e)
  }
}

exports.postLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()

    res.send()
  } catch (e) {
    res.status(500).send()
  }
}
