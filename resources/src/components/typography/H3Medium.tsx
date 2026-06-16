import React from 'react'

interface H3MediumProps {
  className?: string
  children?: any
}

function H3Medium({ className, children }: H3MediumProps) {
  return (
    <h3
      className={`leading-[1.3] md:leading-[1.3]  md:text-2xl text-lg text-white font-bold font-manrope w-full tracking-[-0.24px]  ${className}`}
    >
      {children}
    </h3>
  )
}

export default H3Medium
