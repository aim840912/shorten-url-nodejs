const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://admin-ray:aim841104@cluster0-j7ls4.mongodb.net/short_url?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology:true
})