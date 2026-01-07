import React from 'react'

// interface LayoutProps {
//   children?: React.ReactNode
//   extended?: boolean
//   display?: 'hidden'
//   position?: string
//   background?: string
//   className?: any
//   childClass?: string
//   fullWidth?: boolean
//   removePadding?: boolean
// }

interface SectionProps {
  children: React.ReactNode
  className?: string
  border?: "y" | "t" | "b"
  id?: string
  style?: React.CSSProperties
  isDark?: boolean
}

export default function Section(props:SectionProps) {
  const { children, className, border = "none", isDark = false } = props
  const borderColor = isDark ? "border-gray-800" : "border-gray-200"
  const borderClass = border === "y" ? "border-y " + borderColor : border === "b" ? "border-b " + borderColor : border === "t" ? "border-t " + borderColor : "border-b" + borderColor
  return (
    <section id={props.id} className={`${className} w-full flex justify-center ${borderClass} ${borderColor}`} style={props.style}>
        {children}
    </section>
  )
}