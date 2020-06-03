/* eslint-disable no-undef */
const mongoose = require('mongoose')

const reurlSchema = new mongoose.Schema(
  {
    url_name: {
      type: String,
      required: true,
      trim: true
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    shortUrl: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
)

reurlSchema.path('url_name').validate(val => {
  urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/
  return urlRegex.test(val)
})

const ReUrl = mongoose.model('SUrl', reurlSchema)

module.exports = ReUrl
