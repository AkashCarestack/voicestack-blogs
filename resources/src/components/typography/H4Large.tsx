import React from 'react'

interface H4LargeProps {
  className?: string
  children?: any
}
function H4Large({ className, children }: H4LargeProps) {
  return (
    <h4
      className={`text-[20px] xl:text-2xl md:text-[18px] text-xl font-manrope font-bold leading-[1.3] tracking-[-0.12px] md:tracking-[-0.24px]  ${className}`}
    >
      {children}
    </h4>
  )
}

export default H4Large
