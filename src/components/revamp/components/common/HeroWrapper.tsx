import React from 'react'

export default function HeroWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-12 bg-vs-minimal-bg">
      {children}
    </div>
  )
}