import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import authService from './services/auth'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await authService.login({
        username,
        password,
      })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error.response.data.error, 'what happened')
      setErrorMessage(error.response.data.error)
      console.log(errorMessage, 'here it is')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addNewBlog = async (newBlog) => {
    try {
      const createdBlog = await blogService.create(newBlog)
      console.log(createdBlog)
      setBlogs([...blogs, createdBlog])
      setSuccessMessage(
        `a new blog ${newBlog.title} by ${newBlog.author} added`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (error) {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      await blogService.remove(blog.id)
      const newBlogs = blogs.filter(function (obj) {
        return obj.id !== blog.id
      })
      setBlogs(newBlogs)
    }
  }

  const likeBlog = async (blog) => {
    const result = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    })
    const newBlogs = blogs.map((obj) => {
      if (obj.id === result.id) {
        return result
      }

      return obj
    })
    setBlogs(newBlogs)
  }

  const logout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  useEffect(() => {
    const getBlogs = async () => {
      const newBlogs = await blogService.getAll()
      setBlogs(newBlogs)
    }
    getBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <>
      {user ? (
        <div>
          <h2>blogs</h2>
          <Notification message={successMessage} type="success" />
          <Notification message={errorMessage} type="error" />
          <p>
            {`${user.name} logged in `}
            <button onClick={logout}>logout</button>
          </p>
          <Togglable buttonLabel="create new">
            <BlogForm addNewBlog={addNewBlog} />
          </Togglable>{' '}
          <br />
          {blogs
            .sort((a, b) => (a.likes > b.likes ? -1 : 1))
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                blogs={blogs}
                setBlogs={setBlogs}
                username={user.username}
                removeBlog={removeBlog}
                likeBlog={likeBlog}
              />
            ))}
        </div>
      ) : (
        <>
          <h2>Login to application</h2>
          <Notification message={successMessage} type="success" />
          <Notification message={errorMessage} type="error" />
          <form onSubmit={handleLogin}>
            <div>
              username
              <input
                type="text"
                value={username}
                name="Username"
                onChange={({ target }) => setUsername(target.value)}
                id="Username"
              />
            </div>
            <div>
              password
              <input
                type="password"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
                id="Password"
              />
            </div>
            <button id="Login" type="submit">
              login
            </button>
          </form>
        </>
      )}
    </>
  )
}

export default App
