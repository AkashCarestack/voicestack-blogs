import React from 'react'

interface H3XLProps {
  className?: string
  children?: any
}

function H3XL({ className, children }: H3XLProps) {
  return (
    <h3
      className={`xl:text-5xl text-[30px] leading-[1.1] font-extrabold font-manrope md:leading-tighter w-full tracking-[-0.48px] md:tracking-[-0.96px] ${className}`}
    >
      {children}
    </h3>
  )
}

export default H3XL
