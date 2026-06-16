import { useEffect, useState } from 'react'

export default function useBoundingWidth() {
  let windowObj = typeof window !== 'undefined' ? window : null
  const [device, setDevice] = useState(() => {
    const storedDevice = windowObj?.localStorage.getItem('currentDevice')
    if (storedDevice) {
      return storedDevice
    }

    const newInnerWidth = windowObj?.innerWidth
    if (newInnerWidth >= 0 && newInnerWidth <= 480) {
      return 'smallMobile'
    } else if (newInnerWidth > 480 && newInnerWidth <= 767) {
      return 'largeMobile'
    } else if (newInnerWidth > 768 && newInnerWidth <= 1200) {
      return 'tab'
    } else {
      return 'largerDevice'
    }
  })

  useEffect(() => {
    const handleResize = () => {
      let newInnerWidth = windowObj?.innerWidth
      let newDevice

      if (newInnerWidth >= 0 && newInnerWidth <= 480) {
        newDevice = 'smallMobile'
      } else if (newInnerWidth > 480 && newInnerWidth <= 767) {
        newDevice = 'largeMobile'
      } else if (newInnerWidth > 768 && newInnerWidth <= 1200) {
        newDevice = 'tab'
      } else {
        newDevice = 'largerDevice'
      }

      setDevice((prevDevice) => {
        if (prevDevice !== newDevice) {
          windowObj?.localStorage.setItem('currentDevice', newDevice)
        }
        return newDevice
      })
    }

    const handleResizeDebounced = debounce(handleResize, 800)

    handleResize()
    windowObj?.addEventListener('resize', handleResizeDebounced)

    return () => {
      windowObj?.removeEventListener('resize', handleResizeDebounced)
    }
  }, [windowObj])

  return device
}

function debounce(callback, delay) {
  let timeoutId
  return function () {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      callback.apply(this, arguments)
    }, delay)
  }
}

export type DeviceType =
  | 'smallMobile'
  | 'largeMobile'
  | 'tab'
  | 'largerDevice'
  | null
