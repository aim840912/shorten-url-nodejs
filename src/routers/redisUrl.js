const redis = require('ioredis')
const shortId = require('short-id')

const client = new redis()

client.on("error", function (err) {
    console.log("Error " + err)
})

exports.createShortUrlRedis = function (url,_id) {
    // let _id = shortId.generate()

    return client.hexists("shorten_url", _id).then((ans) => {
        if (ans = 0) {
            return client.hset("shorten_url", _id, url)
        }
        callee()
    }).then(ans => {
        return _id
    }).catch(err => {
        console.log("create shorten URL failed", err)
        throw err
    })
}

exports.findShortUrlRedis = function (_id) {
    return client.hexists("shorten_url", _id).then(ans => {
        if (ans != 0) {
            return client.zincrby('page_rank', 1, _id)
        }
        throw Error('IDNotExist');
    }).then(ans => {
        return client.hget('shorten_url', _id)
    }).then(and => {
        return ans
    }).catch(err => {
        console.log('findShortUrlRedis failed : ' + err)
        throw err
    })
}