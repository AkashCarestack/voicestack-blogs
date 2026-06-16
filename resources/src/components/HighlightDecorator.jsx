import React from 'react'

export default function HighlightDecorator({ children }) {
  return (
    <span
      style={{ display: 'block', backgroundColor: 'yellow', padding: '15px' }}
    >
      {children}
    </span>
  )
}
