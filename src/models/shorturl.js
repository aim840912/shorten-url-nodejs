const mongoose = require("mongoose")

const shorturlSchema = new mongoose.Schema(
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
        }
    },
    {
        timestamps: true
    }
)

const ShortUrl=mongoose.model('ShortUrl',shorturlSchema)

module.exports=ShortUrl