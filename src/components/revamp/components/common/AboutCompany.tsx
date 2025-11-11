import React, { useState } from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from './sectionHeader'
import Image from 'next/image'

interface AboutCompanyProps {
  heading?: string
  description?: string
  image?: string
  icon?: {
    url?: string
    altText?: string
    metadata?: {
      dimensions?: {
        width?: number
        height?: number
      }
    }
  } | null
}

const MAX_DESCRIPTION_LENGTH = 200

export default function AboutCompany({ heading, description, image, icon }: AboutCompanyProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const imageUrl = image || icon?.url
  const imageAlt = heading || icon?.altText || 'Company icon'
  const imageWidth = icon?.metadata?.dimensions?.width || 100
  const imageHeight = icon?.metadata?.dimensions?.height || 100

  if (!imageUrl) return null

  // Check if description needs truncation
  const descriptionText = description || ''
  const needsTruncation = descriptionText.length > MAX_DESCRIPTION_LENGTH
  const displayText = isExpanded || !needsTruncation 
    ? descriptionText 
    : `${descriptionText.substring(0, MAX_DESCRIPTION_LENGTH)}...`

  return (
    <Section className='bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA] py-6 md:py-sm lg:py-md'>
        <Container className='flex flex-col gap-4 px-4 md:px-0'> 
            <div className='flex flex-col gap-6 md:gap-y-12 justify-center md:flex-row md:gap-x-8 md:justify-between'>
                <div className="w-full md:max-w-[502px] flex-1 flex flex-col self-center gap-4 md:gap-8">
                {heading && (
                  <h2 className="leading-[120%] text-left tracking-normal mb-2 md:mb-4 font-manrope font-bold text-2xl md:text-3xl lg:text-[40px] text-gray-900">{heading}</h2>
                )}
                {description && (
                  <div className="text-left">
                    <p className='text-base md:text-lg lg:text-lg text-left font-normal leading-[155.55%] [&_span]:text-vs-blue text-gray-700'>
                      {displayText}
                    </p>
                    {needsTruncation && (
                      <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-2 text-left text-vs-blue font-semibold hover:underline cursor-pointer text-sm md:text-base"
                      >
                        {isExpanded ? 'See less' : 'See more'}
                      </button>
                    )}
                  </div>
                )}
                </div>
                <div 
                  className={`w-full md:w-[606px] flex-shrink-0 ${isExpanded ? 'md:sticky md:top-[100px]' : ''}`}
                >
                    <div className="relative w-full aspect-[4/3] md:w-[606px] md:h-[454px] rounded-[18px] overflow-hidden">
                      <Image 
                        src={imageUrl} 
                        alt={imageAlt} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 606px"
                      />
                    </div>
                </div>
            </div>
        </Container>
    </Section>
  )
}
