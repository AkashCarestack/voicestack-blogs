import React from 'react'

interface XSMediumProps {
  className?: string
  children?: any
}
function XSMedium({ className, children }: XSMediumProps) {
  return (
    <span className={`text-white text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

export default XSMedium
