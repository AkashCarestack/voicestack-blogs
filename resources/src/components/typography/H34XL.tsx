import React from 'react'

interface H34XLProps {
  className?: string
  children?: any
}

function H34XL({ className, children }: H34XLProps) {
  return (
    <h3
      className={`xl:text-4xl text-[26px] leading-[1.1] font-extrabold font-manrope md:leading-tighter w-full tracking-[-0.48px] md:tracking-[-0.96px] ${className}`}
    >
      {children}
    </h3>
  )
}

export default H34XL
