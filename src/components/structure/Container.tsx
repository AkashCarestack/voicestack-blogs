import React from 'react'

export default function Container(props) {
  return (
    <div className={`flex w-full max-w-7xl m-auto px-4 ${props.className}`}>
      {props.children}
    </div>
  )
}
