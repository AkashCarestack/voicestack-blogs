import React from 'react'

interface SubTextProps {
  className?: string
  children?: any
}
function SubText({ className, children }: SubTextProps) {
  return (
    <span className={`font-geist uppercase text-zinc-500 text-xs lg:text-sm font-medium ${className}`}>{children}</span>
  )
}

export default SubText
