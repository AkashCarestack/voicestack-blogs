import React from 'react'

interface H3LargeProps {
  className?: string
  children?: any
}

function H3Large({ className, children }: H3LargeProps) {
  return (
    <h3
      className={`text-[20px] md:text-2xl xl:text-4xl font-bold font-manrope  w-full  ${className}`}
    >
      {children}
    </h3>
  )
}

export default H3Large
