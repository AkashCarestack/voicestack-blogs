import { useEffect, useState } from 'react'

export default function useMediaQuery(res: number, isMin?: boolean) {
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)

  useEffect(() => {
    const mediaWatcher = window.matchMedia(
      `screen and (${isMin ? 'min-width' : 'max-width'}: ${res}px)`,
    )
    setIsNarrowScreen(mediaWatcher.matches)
    function updateIsNarrowScreen(e: any) {
      setIsNarrowScreen(e.matches)
    }

    if (mediaWatcher.addEventListener) {
      mediaWatcher.addEventListener('change', updateIsNarrowScreen)

      return function cleanup() {
        mediaWatcher.removeEventListener('change', updateIsNarrowScreen)
      }
    } else {
      mediaWatcher.addListener(updateIsNarrowScreen)

      return function cleanup() {
        mediaWatcher.removeListener(updateIsNarrowScreen)
      }
    }
  }, [res, isMin])
  return isNarrowScreen
}
