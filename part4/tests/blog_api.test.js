const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async() => {
  await Blog.deleteMany({})
})

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

test('a valid blog can be added ', async () => {
  const initialBlogs = await api.get('/api/blogs')
  const newBlog = {
    'title': 'test',
    'author': 'test',
    'url': 'test',
    'likes': 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(response.body.length).toBe(initialBlogs.body.length + 1)
  expect(titles).toContain('test')
})

test('if likes is missing, it is set to 0', async () => {
  const newBlog = {
    'title': 'test',
    'author': 'test',
    'url': 'test'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api
    .get('/api/blogs')

  expect(response.body[response.body.length - 1].likes).toBe(0)
})

test('if title or url is missing, it is not added', async () => {
  const newBlog = {
    'author': 'test',
    'likes': 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)


})

test('deletion of a note', async () => {
  const newBlog = {
    'title': 'test',
    'author': 'test',
    'url': 'test',
    'likes': 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const response = await api
    .get('/api/blogs')

  const blogToDelete = response.body[response.body.length - 1]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const response2 = await api
    .get('/api/blogs')

  const titles = response2.body.map(r => r.title)

  expect(titles).not.toContain(blogToDelete.title)
})

test('updating likes', async () => {
  const newBlog = {
    'title': 'test',
    'author': 'test',
    'url': 'test',
    'likes': 0
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)

  const response = await api
    .get('/api/blogs')

  const blogToUpdate = response.body[response.body.length - 1]

  await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({
      'likes': 1
    })
    .expect(200)

  const response2 = await api
    .get('/api/blogs')

  expect(response2.body[response2.body.length - 1].likes).toBe(1)
})