const request = require('supertest')
const app = require('../src/app')
const shortId = require('short-id')
const User = require('../src/models/user')
const SUrl = require('../src/models/shorturl')
const { userOne, userOneId, urlOne, urlOneId, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should create a new surl', async () => {
    const generateSurl = shortId.generate()

    const response = await (await request(app)
        .post('/surl/submit'))
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            url_name: "https://www.facebook.com/",
            owner: userOneId,
        }).expect(201)

    const surl = await SUrl.findById(response.body.surl.url_name)
    expect(surl).not.toBeNull()

    expect(response.body).toMatchObject({
        surl: {
            url_name: "https://www.facebook.com/",
            owner: userOneId,
        }
    })
    // expect(surl.shortUrl).toBe(`/surl/ + ${generateSurl}`)
})

test('should find all urls', async () => {
    const response = await request(app)
        .get('/surl')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should delete url', async () => {
    const response = await request(app)
        .delete(`/surl/${urlOne._id}`)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(201)
})