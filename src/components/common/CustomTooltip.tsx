
import React, { ReactNode, useState } from 'react'

type CursorTooltipProps = {
  children: ReactNode
  tooltip: ReactNode
  offsetX?: number
  offsetY?: number
  className?: string
}

const CursorTooltip: React.FC<CursorTooltipProps> = ({
  className,
  children,
  tooltip,
  offsetX = 5,
  offsetY = 5,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const tooltipWidth = 200
    const tooltipHeight = 40

    let x = e.clientX + offsetX
    let y = e.clientY + offsetY

    const padding = 8
    const maxX = window.innerWidth - tooltipWidth - padding
    const maxY = window.innerHeight - tooltipHeight - padding

    if (x > maxX) x = e.clientX - tooltipWidth - offsetX
    if (y > maxY) y = e.clientY - tooltipHeight - offsetY

    setPosition({ x, y })
  }

  if (!tooltip) return <>{children}</>

  return (
    <div
      className={`flex relative ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {visible && (
        <div
          className={`md:block hidden text-sm bg-white text-black px-3 py-2 rounded-md fixed pointer-events-none z-[99999] max-w-[200px] break-words`}
          style={{
            top: position.y,
            left: position.x,
            lineHeight: '1.2',
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  )
}

export default CursorTooltip
