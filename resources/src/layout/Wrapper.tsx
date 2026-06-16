import React from 'react'

interface LayoutProps {
  children?: React.ReactNode
  extended?: boolean
  display?: 'hidden'
  position?: string
  background?: string
  className?: any
  fullWidth?: boolean
  removePadding?: boolean
}

const Wrapper: React.FunctionComponent<LayoutProps> = ({
  children,
  extended,
  display,
  background,
  position,
  className,
  fullWidth = false,
  removePadding = false,
}) => {
  return <div className={` flex w-full max-w-7xl ${className}`}>{children}</div>
}

export default Wrapper
