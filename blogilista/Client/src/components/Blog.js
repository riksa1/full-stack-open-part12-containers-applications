import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, username, removeBlog, likeBlog }) => {
  const [show, setShow] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const paragraphStyle = {
    margin: 0,
  }

  return (
    <div>
      {show ? (
        <div style={blogStyle} className="blog">
          <h4 style={paragraphStyle}>
            {blog.title} <button onClick={() => setShow(!show)}>hide</button>
          </h4>
          <h4 style={paragraphStyle} id="url">
            {blog.url}
          </h4>
          <h4 style={paragraphStyle} id="likes">
            {`likes ${blog.likes} `}
            <button onClick={() => likeBlog(blog)}>like</button>
          </h4>
          <h4 style={paragraphStyle}>{blog.author}</h4>
          {username === blog.user.username ? (
            <button
              style={{ backgroundColor: 'blue' }}
              onClick={() => removeBlog(blog)}
            >
              remove
            </button>
          ) : null}
        </div>
      ) : (
        <div style={blogStyle} className="blog">
          <h4 style={paragraphStyle} id="text">
            {blog.title} {blog.author}{' '}
            <button onClick={() => setShow(!show)}>view</button>
          </h4>
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  blogs: PropTypes.array,
  setBlogs: PropTypes.func,
  username: PropTypes.string,
  removeBlog: PropTypes.func,
  likeBlog: PropTypes.func,
}

export default Blog
