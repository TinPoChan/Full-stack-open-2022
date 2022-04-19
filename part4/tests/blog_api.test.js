const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})

test('returned id is id insteald of _id', async () => {
  await api
    .post('/api/blogs')
    .send({

      'title': 'test',
      'author': 'test',
      'url': 'test',
      'likes': 0
    })

  const response = await api
    .get('/api/blogs')

  expect(response.body[0].id).toBeDefined()
})