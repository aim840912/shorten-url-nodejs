/* eslint-disable no-shadow */
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const User = require('../models/user')

module.exports = passport => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: process.env.FACEBOOK_CALLBACK,
        profileFields: ['displayName', 'email'],
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, done) => {
        User.findOne({ email: profile._json.email })
          .then(user => {
            // existing user
            if (user) {
              return done(null, user)
            }
            // new user
            const randomPassword = Math.random()
              .toString(36)
              .slice(-8)
            // encrypt password
            return bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(randomPassword, salt, (err, hash) => {
                if (err) throw err
                const newUser = new User({
                  name: profile._json.name,
                  email: profile._json.email,
                  password: hash
                })
                // Save document to user collection
                newUser
                  .save()
                  .then(user => done(null, user))
                  .catch(err => console.error(err))
              })
            })
          })
          .catch(err =>
            done(err, false, req.flash('fail_msg', 'Facebook 驗證失敗'))
          )
      }
    )
  )
  // serialize user instance to the session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // deserialize user instance from the session
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
