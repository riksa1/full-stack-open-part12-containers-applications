import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'
import userEvent from '@testing-library/user-event'

describe('frontend blog tests', () => {
  test('check if parent contains specific child component and not others', () => {
    const blog = {
      author: 'Riko',
      title: 'Title of blog',
      url: 'https',
      likes: 9,
    }

    const container = render(<Blog blog={blog} />)

    const element = container.queryByTestId('text')
    const element2 = container.queryByTestId('url')
    const element3 = container.queryByTestId('likes')
    expect(element).toBeDefined()
    expect(element2).toBeNull()
    expect(element3).toBeNull()
  })

  test('clicking the button shows the likes and url', async () => {
    const blog = {
      author: 'Riko',
      title: 'Title of blog',
      url: 'https',
      likes: 9,
      user: {
        username: 'Test',
      },
    }

    const container = render(<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    const element = container.queryByTestId('text')
    const element2 = container.queryByTestId('url')
    const element3 = container.queryByTestId('likes')
    expect(element).toBeNull()
    expect(element2).toBeDefined()
    expect(element3).toBeDefined()
  })

  test('clicking the like button twice is registered', async () => {
    const blog = {
      author: 'Riko',
      title: 'Title of blog',
      url: 'https',
      likes: 9,
      user: {
        username: 'Test',
      },
    }

    const mockHandler = jest.fn()

    render(<Blog blog={blog} likeBlog={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')

    await user.click(button)

    const button2 = screen.getByText('like')

    await user.click(button2)
    await user.click(button2)

    expect(mockHandler.mock.calls).toHaveLength(2)
  })

  test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const user = userEvent.setup()
    const createBlog = jest.fn()

    render(<BlogForm addNewBlog={createBlog} />)

    const input = screen.getByPlaceholderText('Title')
    const input2 = screen.getByPlaceholderText('Author')
    const input3 = screen.getByPlaceholderText('Url')
    const sendButton = screen.getByText('create')

    await user.type(input, 'new title for the blog')
    await user.type(input2, 'author for the blog')
    await user.type(input3, 'url used in the blog')
    await user.click(sendButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe('new title for the blog')
    expect(createBlog.mock.calls[0][0].author).toBe('author for the blog')
    expect(createBlog.mock.calls[0][0].url).toBe('url used in the blog')
  })
})
