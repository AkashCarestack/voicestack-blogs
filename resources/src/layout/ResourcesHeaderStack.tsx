import { useEffect, useRef, useState } from 'react'

import VsHeader from '~/components/common/Header'
import ResourcesHeader from '~/resources/layout/Header'
import { useHeaderContext } from '~/providers/HeaderContextProvider'
import { useLayoutData } from '~/providers/LayoutDataProvider'

const VS_FULL_HEIGHT_DESKTOP = 105
const VS_MAIN_HEIGHT_DESKTOP = 63
const VS_FULL_HEIGHT_MOBILE = 48
const REGION_STRIP_HEIGHT_DESKTOP = 40
const REGION_STRIP_HEIGHT_MOBILE = 48
const RESOURCES_STACK_SPACER_DESKTOP = 180
const RESOURCES_STACK_SPACER_MOBILE = 112

function getRegionStripOffset(isMobile: boolean, hasRegionStrip: boolean): number {
  if (!hasRegionStrip) return 0
  return isMobile ? REGION_STRIP_HEIGHT_MOBILE : REGION_STRIP_HEIGHT_DESKTOP
}

function getVsVisibleHeight(
  showMain: boolean,
  showStrip: boolean,
  isMobile: boolean,
  hasRegionStrip: boolean,
): number {
  const regionOffset = getRegionStripOffset(isMobile, hasRegionStrip)

  if (!showMain) return regionOffset
  if (isMobile) return VS_FULL_HEIGHT_MOBILE + regionOffset
  if (showStrip) return VS_FULL_HEIGHT_DESKTOP + regionOffset
  return VS_MAIN_HEIGHT_DESKTOP + regionOffset
}

function getResourcesStackSpacer(hasRegionStrip: boolean) {
  return {
    desktop:
      RESOURCES_STACK_SPACER_DESKTOP +
      (hasRegionStrip ? REGION_STRIP_HEIGHT_DESKTOP : 0),
    mobile:
      RESOURCES_STACK_SPACER_MOBILE +
      (hasRegionStrip ? REGION_STRIP_HEIGHT_MOBILE : 0),
  }
}

export default function ResourcesHeaderStack() {
  const { headerData } = useLayoutData()
  const {
    setShowTopStrip,
    setShowMainHeader,
    setResourcesHeaderTop,
    setShowResourceCtas,
    setIsResourcesPage,
    resourcesHeaderTop,
    hasRegionStrip,
  } = useHeaderContext()

  const [headerFixed, setHeaderFixed] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    setIsResourcesPage(true)
    return () => setIsResourcesPage(false)
  }, [setIsResourcesPage])

  useEffect(() => {
    const { desktop, mobile } = getResourcesStackSpacer(hasRegionStrip)
    document.documentElement.style.setProperty(
      '--resources-stack-spacer',
      `${desktop}px`,
    )
    document.documentElement.style.setProperty(
      '--resources-stack-spacer-mob',
      `${mobile}px`,
    )

    return () => {
      document.documentElement.style.removeProperty('--resources-stack-spacer')
      document.documentElement.style.removeProperty('--resources-stack-spacer-mob')
    }
  }, [hasRegionStrip])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollingUp = currentScrollY < lastScrollY.current
      const isMobile = window.innerWidth < 1024

      setHeaderFixed(currentScrollY > 44)

      let nextShowTopStrip = true
      let nextShowMainHeader = true

      if (currentScrollY <= 0) {
        nextShowTopStrip = true
        nextShowMainHeader = true
      } else if (scrollingUp) {
        nextShowTopStrip = true
        nextShowMainHeader = true
      } else {
        nextShowTopStrip = false
        nextShowMainHeader = currentScrollY <= 200
      }

      setShowTopStrip(nextShowTopStrip)
      setShowMainHeader(nextShowMainHeader)
      setShowResourceCtas(!nextShowMainHeader && currentScrollY > 0)
      setResourcesHeaderTop(
        getVsVisibleHeight(
          nextShowMainHeader,
          nextShowTopStrip,
          isMobile,
          hasRegionStrip,
        ),
      )

      lastScrollY.current = currentScrollY
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [
    setShowTopStrip,
    setShowMainHeader,
    setResourcesHeaderTop,
    setShowResourceCtas,
    hasRegionStrip,
  ])

  return (
    <>
      {headerData && <VsHeader data={headerData} variant="resources" />}
      <ResourcesHeader
        topOffset={resourcesHeaderTop}
        headerFixed={headerFixed}
      />
    </>
  )
}
