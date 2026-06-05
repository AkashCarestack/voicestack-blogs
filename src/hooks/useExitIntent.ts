import { useCallback, useEffect, useRef, useState } from 'react'

interface UseExitIntentOptions {
  enabled?: boolean
}

const EXIT_INTENT_TOP_THRESHOLD = 12

function isNearTopEdge(event: MouseEvent): boolean {
  return event.clientY <= EXIT_INTENT_TOP_THRESHOLD
}

function isLeavingDocument(event: MouseEvent): boolean {
  const related = event.relatedTarget as Node | null
  return related === null || related === document.documentElement
}

export function useExitIntent({ enabled = true }: UseExitIntentOptions = {}) {
  const [triggered, setTriggered] = useState(false)
  const isShowingRef = useRef(false)
  const lastMouseYRef = useRef(0)

  const markTriggered = useCallback(() => {
    if (isShowingRef.current) return

    isShowingRef.current = true
    setTriggered(true)
  }, [])

  const dismiss = useCallback(() => {
    isShowingRef.current = false
    setTriggered(false)
  }, [])

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const handleMouseLeave = (event: MouseEvent) => {
      if (isNearTopEdge(event)) {
        markTriggered()
      }
    }

    // Safari (macOS) often fires mouseout instead of mouseleave when leaving toward the tab bar.
    const handleMouseOut = (event: MouseEvent) => {
      if (isLeavingDocument(event) && isNearTopEdge(event)) {
        markTriggered()
      }
    }

    // Backup for browsers that don't emit leave/out reliably near the viewport edge.
    const handleMouseMove = (event: MouseEvent) => {
      const movingUp = event.clientY < lastMouseYRef.current
      lastMouseYRef.current = event.clientY

      if (movingUp && event.clientY <= 4) {
        markTriggered()
      }
    }

    const targets: EventTarget[] = [
      document,
      document.documentElement,
      document.body,
    ]

    targets.forEach((target) => {
      target.addEventListener('mouseleave', handleMouseLeave as EventListener)
      target.addEventListener('mouseout', handleMouseOut as EventListener)
    })
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      targets.forEach((target) => {
        target.removeEventListener('mouseleave', handleMouseLeave as EventListener)
        target.removeEventListener('mouseout', handleMouseOut as EventListener)
      })
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [enabled, markTriggered])

  return { triggered, dismiss }
}
