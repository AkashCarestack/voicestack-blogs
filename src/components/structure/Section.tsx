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
}

export default function Section(props:SectionProps) {
  const { children, className, border = "none" } = props
  const borderClass = border === "y" ? "border-y border-gray-200" : border === "b" ? "border-b border-gray-200" : border === "t" ? "border-t border-gray-200" : ""
  return (
    <section id={props.id} className={`${className} w-full flex justify-center ${borderClass}`} style={props.style}>
        {children}
    </section>
  )
}