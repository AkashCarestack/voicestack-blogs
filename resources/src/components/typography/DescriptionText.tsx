import React from 'react'

interface DescriptionTextProps {
  className?: string
  children?: any
}
function DescriptionText({ className, children }: DescriptionTextProps) {
  return (
    <p className={`text-white text-base font-medium ${className}`}>
      {children}
    </p>
  )
}

export default DescriptionText
