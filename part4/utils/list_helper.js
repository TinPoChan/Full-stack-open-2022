const _ = require('lodash')
// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => {
    if (max === undefined) {
      return blog
    }
    if (blog.likes > max.likes) {
      return blog
    }
    return max
  }, undefined)
}

const mostBlogs = (blogs) => {
  return _.maxBy(blogs, 'blogs')
}

const mostLikes = (blogs) => {
  return _.maxBy(blogs, 'likes')
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}