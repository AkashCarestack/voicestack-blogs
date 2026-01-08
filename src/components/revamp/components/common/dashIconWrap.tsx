import React from 'react'

export default function DashIconWrap({children}: {children: React.ReactNode}) {
  return (
    <div className="flex items-center justify-center px-2 py-4 border-gray-200 text-gray-400">
        {children}
    </div>
  )
}
