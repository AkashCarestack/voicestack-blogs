import { useEffect, useRef, useState, useCallback } from 'react'

interface UseIntersectionObserverOptions {
  threshold?: number | number[]
  rootMargin?: string
  enabled?: boolean
  minScore?: number
  debug?: boolean
}

interface VisibilityScore {
  intersectionRatio: number
  positionScore: number
  sizeScore: number
  combinedScore: number
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const {
    threshold = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    rootMargin = '-10% 0px -10% 0px',
    enabled = true,
    minScore = 0.3,
    debug = false
  } = options

  const [activeElement, setActiveElement] = useState<string>('')
  const [debugScores, setDebugScores] = useState<Map<string, VisibilityScore>>(new Map())
  const elementRefs = useRef<(HTMLDivElement | null)[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)
  const visibilityScores = useRef<Map<string, VisibilityScore>>(new Map())

  // Calculate visibility score for an element
  const calculateVisibilityScore = useCallback((entry: IntersectionObserverEntry): VisibilityScore => {
    const intersectionRatio = entry.intersectionRatio
    const boundingRect = entry.boundingClientRect
    const viewportHeight = window.innerHeight
    
    // Calculate position score (center of viewport gets higher score)
    const centerY = boundingRect.top + boundingRect.height / 2
    const viewportCenter = viewportHeight / 2
    const distanceFromCenter = Math.abs(centerY - viewportCenter)
    const positionScore = Math.max(0, 1 - (distanceFromCenter / viewportHeight))
    
    // Calculate size score (larger visible area gets higher score)
    const visibleArea = boundingRect.width * boundingRect.height * intersectionRatio
    const totalArea = boundingRect.width * boundingRect.height
    const sizeScore = totalArea > 0 ? visibleArea / totalArea : 0
    
    // Combined score: intersection ratio + position + size
    const combinedScore = (intersectionRatio * 0.4) + (positionScore * 0.3) + (sizeScore * 0.3)
    
    return {
      intersectionRatio,
      positionScore,
      sizeScore,
      combinedScore
    }
  }, [])

  // Set up intersection observer
  const setupObserver = useCallback(() => {
    if (!enabled) return

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const elementKey = entry.target.getAttribute('data-key')
          if (!elementKey) return

          const score = calculateVisibilityScore(entry)
          visibilityScores.current.set(elementKey, score)
        })

        // Find the element with the highest combined score
        let maxScore = 0
        let mostVisibleKey = activeElement

        visibilityScores.current.forEach((score, key) => {
          if (score.combinedScore > maxScore) {
            maxScore = score.combinedScore
            mostVisibleKey = key
          }
        })

        // Update debug scores for analysis
        if (debug) {
          setDebugScores(new Map(visibilityScores.current))
        }

        // Only update if we have a significant difference to prevent flickering
        if (maxScore > minScore && mostVisibleKey !== activeElement) {
          setActiveElement(mostVisibleKey)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    // Observe all elements
    elementRefs.current.forEach((element) => {
      if (element && observerRef.current) {
        observerRef.current.observe(element)
      }
    })
  }, [enabled, threshold, rootMargin, minScore, debug, activeElement, calculateVisibilityScore])

  // Register an element for observation
  const registerElement = useCallback((index: number, element: HTMLDivElement | null) => {
    elementRefs.current[index] = element
  }, [])

  // Scroll to a specific element
  const scrollToElement = useCallback((elementKey: string) => {
    
    const targetElement = elementRefs.current.find(el => 
      el?.getAttribute('data-key') === elementKey
    )
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' })
      setActiveElement(elementKey)
    }
  }, [])

  // Get all visibility scores
  const getAllScores = useCallback(() => {
    return Array.from(visibilityScores.current.entries()).map(([key, score]) => ({
      key,
      ...score
    }))
  }, [])

  // Get score for specific element
  const getElementScore = useCallback((elementKey: string) => {
    return visibilityScores.current.get(elementKey)
  }, [])

  // Set up observer when enabled or dependencies change
  useEffect(() => {
    if (enabled) {
      setupObserver()
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enabled, setupObserver])

  return {
    activeElement,
    setActiveElement,
    scrollToElement,
    registerElement,
    getAllScores,
    getElementScore,
    debugScores: debug ? debugScores : new Map(),
    elementRefs: elementRefs.current
  }
}

export default useIntersectionObserver
