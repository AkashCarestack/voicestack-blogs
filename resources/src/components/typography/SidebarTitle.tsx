import React from 'react'

interface SidebarTitlesProps {
  className?: string
  children?: any
}
function SidebarTitle({ className, children }: SidebarTitlesProps) {
  return (
    <span
      className={`md:text-base font-medium text-zinc-900 ${className ? className : ''}`}
    >
      {children}
    </span>
  )
}

export default SidebarTitle
