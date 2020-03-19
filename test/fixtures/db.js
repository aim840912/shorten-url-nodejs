const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const User=require('../../src/models/user')

const userOneId=new mongoose.Types.ObjectId()
const userOne={
    _id:userOneId,
    name:'Mike',
    email:'mike@example.com',
    password:'mdiwkwwdw',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Jess',
    email: 'jess@example.com',
    password: 'myhouse099@@',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

// const urlOneId=new mongoose.Types.ObjectId()
// const urlOne={
//     _id:urlOneId,
//     url_name:'',
//     owner:'',
//     shortUrl:''
// }

const setupDatabase=async()=>{
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
}

module.exports={
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase
}