const router = new express.Router()

const auth = require('../middleware/auth')
const userRedio=require('./redisUser')

router.get('/user/allurl', auth, async (req, res) => {
    console.log(req.user.email)

    try {
        const user = await User.findOne({ email: req.user.email })

        res.json({ user })
    } catch (e) {


    }

})

module.exports = router 