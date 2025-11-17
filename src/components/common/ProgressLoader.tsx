'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const ProgressLoader = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    let progressInterval: NodeJS.Timeout

    const handleStart = () => {
      setIsLoading(true)
      setProgress(0)
      
      progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev ;
          const increment = Math.random() * 8 + 2
          return Math.min(prev + increment, 90)
        })
      }, 150)
    }

    const handleComplete = () => {
      setProgress(100)
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 300)
    }

    const handleError = () => {
      setIsLoading(false)
      setProgress(0)
    }

    // Listen to router events
    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleError)

    // Cleanup
    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleError)
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [router.events])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main progress bar */}
      <div 
        className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out shadow-lg relative overflow-hidden"
        style={{ width: `${progress}%` }}
      >
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse" />
      </div>
      
      {/* Background track */}
      <div className="h-1 bg-gray-100" />
      
      {/* Optional: Add a subtle glow effect */}
      <div 
        className="absolute top-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 blur-sm transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default ProgressLoader
