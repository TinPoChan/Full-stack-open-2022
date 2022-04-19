const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
  })
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
})

describe('favorite blog', () => {
  const blog = [
    {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      likes: 12
    },
    {
      title: 'test',
      author: 'test',
      likes: 50
    }
  ]

  test('favorite blog', () => {
    const result = listHelper.favoriteBlog(blog)
    expect(result).toEqual(blog[1])
  })
})

describe('most blogs', () => {
  const blog = [
    {
      author: 'Robert C. Martin',
      blogs: 3
    },
    {
      author: 'test C. Martin',
      blogs: 5
    },
    {
      author: 'test C. test',
      blogs: 10
    },
  ]

  test('most blogs', () => {
    const result = listHelper.mostBlogs(blog)
    expect(result).toEqual(blog[2])
  })
})

describe('most likes', () => {
  const blog = [
    {
      author: 'Edsger W. Dijkstra',
      likes: 17
    },
    {
      author: 'test W. Dijkstra',
      likes: 18
    },
    {
      author: '1123123 W. Dijkstra',
      likes: 1123
    }
  ]

  test('most likes', () => {
    const result = listHelper.mostLikes(blog)
    expect(result).toEqual(blog[2])
  })
})