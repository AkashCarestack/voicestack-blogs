import React from 'react'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  type?: "V1" | "V2"
  border?: "all" | "t-0" | "b-0" | "y-0" | "l"
  innerPadding?: boolean
  darkTheme?: boolean
}

export default function Container(props:ContainerProps) {
  const { children, className, type = "V1", border = "none", innerPadding = false, darkTheme = false } = props
  const borderColor = darkTheme ? "border-gray-800" : "border-gray-200"
  const borderClass = border === "all" ? `border ${borderColor}` : border === "l" ? `border-l ${borderColor}` : border === "t-0" ? `border ${borderColor} border-t-0` : border === "b-0" ? `border ${borderColor} border-b-0` : border === "y-0" ? `border ${borderColor} border-y-0` : ""
  if (type === "V2") {
    return (
      <div className={`flex w-full max-w-[1372px] m-auto px-4`}>
        <div className={`w-full ${borderClass} ${className} ${innerPadding ? 'xl:px-12 md:px-6 px-4' : ''}`}>
          {children}
        </div>
      </div>
    ) 
  }
  return (
    <div className={`flex w-full max-w-7xl m-auto px-4 ${className}`}>
      {children}
    </div>
  )
}
