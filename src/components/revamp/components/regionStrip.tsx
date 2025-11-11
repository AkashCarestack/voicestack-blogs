import Link from 'next/link'
import React from 'react'

interface RegionStripProps {
  locale: string
  className?: string
}

const getRegionName = (locale: string): string => {
  const regionMap: { [key: string]: string } = {
    'en': 'USA',
    'en-GB': 'UK',
    'en-AU': 'AU',
  }
  return regionMap[locale] || 'USA'
}

export default function RegionStrip({ locale, className }: RegionStripProps) {
  const regionName = getRegionName(locale)
  
  const getOtherRegions = () => {
    if (regionName === 'USA') {
      return [
        { name: 'UK', locale: 'en-GB' },
        { name: 'AU', locale: 'en-AU' },
      ]
    } else if (regionName === 'UK') {
      return [
        { name: 'USA', locale: 'en' },
        { name: 'AU', locale: 'en-AU' },
      ]
    } else if (regionName === 'AU') {
      return [
        { name: 'USA', locale: 'en' },
        { name: 'UK', locale: 'en-GB' },
      ]
    }
    return []
  }

  const otherRegions = getOtherRegions()

  return (
    <div
      className={`w-full md:h-[28px] md:px-12 px-4 md:py-1.5 py-1 h-[20px] flex items-center justify-start gap-6 ${className}`}
      style={{
        background: 'linear-gradient(90deg, #4A3CE1 0%, #191078 100%)',
      }}
    >
      <div className="text-white text-xs font-geist leading-[142.857%] md:text-sm font-medium">
        You are currently viewing our <span className="font-semibold">{regionName}</span> Website.
      </div>
      {otherRegions.map((region) => (
        <Link
          key={region.locale}
          href="/"
          locale={region.locale}
          className="text-white text-sm font-semibold leading-5 tracking-normal underline decoration-dotted decoration-[12%] underline-offset-[25%] underline-from-font"
          style={{
            textDecorationSkipInk: 'none',
            textDecorationThickness: '12%',
          }}
        >
          Go to VoiceStack {region.name}
        </Link>
      ))}
    </div>
  )
}
