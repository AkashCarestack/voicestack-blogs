import React from 'react'

interface H2LargeProps {
  className?: string
  children?: any
}
function H2Large({ className, children }: H2LargeProps) {
  return (
    <h2
      className={`md:text-h2 text-3xl font-manrope font-extrabold leading-[1.1] ${className}`}
    >
      {children}
    </h2>
  )
}

export default H2Large
