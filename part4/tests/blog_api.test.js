const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const helper = require('./test_helper.test')
//const loginRouter = require('../controllers/login')

const bcrypt = require('bcrypt')
const User = require('../models/user')

let loginUser = null

beforeEach(async() => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()

  loginUser = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)
    .expect('Content-Type', /application\/json/)

})

test('notes are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('returned id is id insteald of _id', async () => {
  await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${loginUser.body.token}`)
    .send({
      'title': 'test',
      'author': 'test',
      'url': 'test',
      'likes': 0
    })

  const response = await api
    .get('/api/blogs')

  console.log(response.body[0])
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
    .set('Authorization', `bearer ${loginUser.body.token}`)
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
    .set('Authorization', `bearer ${loginUser.body.token}`)
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
    .set('Authorization', `bearer ${loginUser.body.token}`)
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
    .set('Authorization', `bearer ${loginUser.body.token}`)
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
    .set('Authorization', `bearer ${loginUser.body.token}`)
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


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

test('invalid users are not created', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: '',
    name: '',
    password: '',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('username or password missing')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})

afterAll(() => {
  mongoose.connection.close()
})