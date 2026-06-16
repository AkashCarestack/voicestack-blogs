import React from 'react'

interface H4MediumProps {
  className?: string
  children?: any
}
function H4Medium({ className, children }: H4MediumProps) {
  return (
    <h4
      className={`text-[20px] xl:text-xl md:text-[18px]  font-manrope font-bold leading-[1.3] tracking-[-0.12px] md:tracking-[-0.24px]  ${className}`}
    >
      {children}
    </h4>
  )
}

export default H4Medium
