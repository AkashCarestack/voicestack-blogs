import React from 'react'

interface XSMediumProps {
  className?: string
  children?: any
}
function XSMedium({ className, children }: XSMediumProps) {
  return (
    <span className={`font-geist text-white text-xs font-medium ${className}`}>
      {children}
    </span>
  )
}

export default XSMedium
