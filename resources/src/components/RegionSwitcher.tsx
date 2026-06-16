import Router, { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import ChevronDown from '~/resources/assets/reactiveAssets/ChevronUp'
import { getResourcesRegionHref } from '~/resources/components/utils/alternatePaths'
import { getResourcesCmsLocale } from '~/resources/utils/common'

import { navigateToResourcesRegion } from '~/resources/utils/resourcesPublicPath'

import ImageLoader from './commonSections/ImageLoader'

interface RegionSwitcherProps {
  className?: string
}

const countryFlagsBase = '/assets/countryFlags'

export const regions = [
  {
    flag: { url: `${countryFlagsBase}/EN-usa.png`, title: 'US' },
    title: 'US',
    locale: 'en',
    regionName: 'USA',
  },
  {
    flag: { url: `${countryFlagsBase}/EN-GB.png`, title: 'UK' },
    title: 'UK',
    locale: 'en-GB',
    regionName: 'UK',
  },
  {
    flag: { url: `${countryFlagsBase}/EN-AU.png`, title: 'AU' },
    title: 'AU',
    locale: 'en-AU',
    regionName: 'ANZ',
  },
]

const RegionSwitcher: React.FC<RegionSwitcherProps> = ({ className }) => {
  const router = useRouter()
  const cmsLocale = getResourcesCmsLocale(router)
  const matchedRegion =
    regions.find((region) => region.locale === cmsLocale) || regions[0]

  const regionLinks = useMemo(
    () =>
      regions.map((region) => ({
        ...region,
        href: getResourcesRegionHref(region.locale, router),
      })),
    [],
  )

  const containerRef = useRef<HTMLDivElement>(null)
  const [openSwitcher, setOpenSwitcher] = useState(false)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpenSwitcher(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleSwitcher = (e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenSwitcher((prev) => {
      const next = !prev
      if (next) {
        regionLinks.forEach((region) => {
          void Router.prefetch(region.href)
        })
      }
      return next
    })
  }

  return (
    <div className={className}>
      {regions.length > 0 && (
        <div className="relative hidden lg:flex w-[76px]" ref={containerRef}>
          <div className="flex md:w-24 px-2 py-[6px] rounded-2xl bg-white/10 w-full shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)]">
            <button
              className="select-none flex w-full items-center gap-2 p-[6px] justify-between cursor-pointer text-gray-900"
              onClick={toggleSwitcher}
              type="button"
            >
              {matchedRegion && (
                <span className="inline-block overflow-hidden rounded-full w-[23px] h-[23px] shrink-0">
                  <ImageLoader
                    image={matchedRegion.flag.url}
                    alt={matchedRegion.flag.title}
                    title={matchedRegion.flag.title}
                    className="!w-[23px] !h-[23px] transform duration-300 group-hover:scale-105 object-cover"
                  />
                </span>
              )}
              <div
                className={`${openSwitcher ? '-rotate-180' : ''} transition-transform linear duration-300`}
              >
                <ChevronDown color="white" />
              </div>
            </button>
          </div>

          <div
            className={`md:w-18 overflow-hidden rounded-2xl bg-white shadow-[0px_7px_40px_0px_rgba(0,0,0,0.10)] absolute top-[calc(100%+4px)] left-0 right-0 flex-col ${openSwitcher ? 'flex' : 'hidden'}`}
          >
            {regionLinks.map((region) =>
              cmsLocale === region.locale ? (
                <div
                  key={region.locale}
                  className="flex gap-2 items-center opacity-80 p-[10px] border-b border-zinc-200 first:rounded-t-2xl last:border-none last:rounded-b-2xl"
                >
                  <span className="inline-block overflow-hidden rounded-full w-[23px] h-[23px] shrink-0">
                    <ImageLoader
                      image={region.flag.url}
                      alt={region.flag.title}
                      title={region.flag.title}
                      width={23}
                      height={23}
                      className="!w-[23px] !h-[23px] transform duration-300 group-hover:scale-105 object-cover"
                    />
                  </span>
                  <span className="text-gray-900 text-sm font-medium">
                    {region.title}
                  </span>
                </div>
              ) : (
                <a
                  key={region.locale}
                  href={region.href}
                  className="flex gap-2 items-center p-[10px] border-b border-zinc-200 hover:bg-zinc-100 transform duration-300 last:border-none last:rounded-b-2xl w-full first:rounded-t-2xl"
                  onMouseEnter={() => {
                    void Router.prefetch(region.href)
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    setOpenSwitcher(false)
                    navigateToResourcesRegion(region.href)
                  }}
                >
                  <span className="inline-block overflow-hidden rounded-full w-[23px] h-[23px] shrink-0">
                    <ImageLoader
                      image={region.flag.url}
                      alt={region.flag.title}
                      title={region.flag.title}
                      width={23}
                      height={23}
                      className="!w-[23px] !h-[23px] transform duration-300 group-hover:scale-105 object-cover"
                    />
                  </span>
                  <span className="text-gray-900 text-sm font-medium">
                    {region.title}
                  </span>
                </a>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default RegionSwitcher
