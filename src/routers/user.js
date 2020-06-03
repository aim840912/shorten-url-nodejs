const express = require('express')
const passport = require('passport')

const auth = require('../middleware/auth')
const { postLogin, postSignUp, postLogout } = require('../controllers/user')

const router = new express.Router()

router.post('/user/signup', postSignUp)

router.post('/user/login', postLogin)

router.post('/user/logout', auth, postLogout)

// Facebook authentication route
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)

// Facebook authentication callback route
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/users/login'
  })
)

module.exports = router
