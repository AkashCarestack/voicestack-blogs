import { useEffect, useRef, useState } from 'react'

interface UseViewportActiveCardOptions {
  threshold?: number
  rootMargin?: string
  enabled?: boolean
}

export function useViewportActiveCard(options: UseViewportActiveCardOptions = {}) {
  const {
    threshold = 0.5,
    rootMargin = '-20% 0px -20% 0px',
    enabled = true
  } = options

  const [activeCard, setActiveCard] = useState<string>('')
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Function to set up intersection observer
  const setupObserver = () => {
    if (!enabled) return

    // Clean up existing observer
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cardKey = entry.target.getAttribute('data-card-key')
            if (cardKey) {
              setActiveCard(cardKey)
            }
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    // Observe all cards
    cardRefs.current.forEach((card) => {
      if (card && observerRef.current) {
        observerRef.current.observe(card)
      }
    })
  }

  // Function to scroll to a specific card
  const scrollToCard = (cardKey: string) => {
    setActiveCard(cardKey)
    const targetCard = cardRefs.current.find(card => 
      card?.getAttribute('data-card-key') === cardKey
    )
    if (targetCard) {
      targetCard.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Function to register a card element
  const registerCard = (index: number, element: HTMLDivElement | null) => {
    cardRefs.current[index] = element
  }

  // Function to unregister all cards
  const unregisterCards = () => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    cardRefs.current = []
  }

  // Set up observer when enabled or cards change
  useEffect(() => {
    if (enabled) {
      setupObserver()
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [enabled, threshold, rootMargin])

  return {
    activeCard,
    setActiveCard,
    scrollToCard,
    registerCard,
    unregisterCards,
    cardRefs: cardRefs.current
  }
}

export default useViewportActiveCard
