import React from 'react'
import PropTypes from 'prop-types'

const Input = ({ name, newValue, handleValueChange, placeHolder, id }) => {
  return (
    <div>
      {name}:{' '}
      <input
        value={newValue}
        onChange={handleValueChange}
        placeholder={placeHolder}
        id={id}
      />
    </div>
  )
}

Input.propTypes = {
  name: PropTypes.string.isRequired,
  newValue: PropTypes.string.isRequired,
  handleValueChange: PropTypes.func.isRequired,
}

export default Input
