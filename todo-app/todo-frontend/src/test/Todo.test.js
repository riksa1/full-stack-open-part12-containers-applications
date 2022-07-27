import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'

const Todo = () => {
  return (
    <div>
      <span>This todo is done</span>
      <span>
        <button> Delete </button>
      </span>
    </div>
  )
}

test('renders content', () => {
  render(<Todo />)

  const element = screen.getByText('This todo is done')
  expect(element).toBeDefined()
})