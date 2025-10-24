import React, { useRef, useState, useEffect } from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver'
import { PortableText } from '@portabletext/react'
import ImageLoader from '~/components/common/imageLoader/imageLoader'

export default function TabCardsListing({ data }: { data: any }) {
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-zinc-700 font-inter text-sm md:text-base !leading-[150%] tracking-normal">
          {children}
        </p>
      ),
    },
  }
  
  const bindEvents = (e: string) => {
    setIsScrolling(true)
    scrollToElement(e)

    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }

    // Set a timeout to re-enable intersection observer after scroll completes
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false)
    }, 1000) // Adjust timing as needed
  }

  const {
    activeElement: activeTabValue,
    scrollToElement,
    registerElement,
  } = useIntersectionObserver({
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    rootMargin: '-10% 0px -10% 0px',
    minScore: 0.8,
    enabled: !isScrolling, // Disable during programmatic scrolling
  })

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Early return if no data - AFTER all hooks
  if (!data || !data.tabs || !Array.isArray(data.tabs) || data.tabs.length === 0) {
    return (
      <Section className="py-sm md:py-md lg:py-lg">
        <Container className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Groups and DSO
            </h1>
            <p className="text-gray-600 text-center max-w-2xl">
              This page is currently being set up. Please check back later.
            </p>
          </div>
        </Container>
      </Section>
    )
  }

  // Additional safety check for data structure
  if (!data.headline || !data.tabs || data.tabs.length === 0) {
    return (
      <Section className="py-sm md:py-md lg:py-lg">
        <Container className="flex flex-col items-center">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Groups and DSO
            </h1>
            <p className="text-gray-600 text-center max-w-2xl">
              This page is currently being set up. Please check back later.
            </p>
          </div>
        </Container>
      </Section>
    )
  }

  return (
    <Section className="py-sm md:py-md lg:py-lg">
      <Container className="flex flex-col items-center">
        <SectionHeader
          heading={data.headline}
          description={data.subDescription}
        />
        <SwitchableTabs
          data={data.tabs.map((e: any) => {
            return {
              key: e._key,
              heading: e.tabHeading,
              title: e.tabHeading,
            }
          })}
          activeTab={activeTabValue}
          setActiveTab={(e: string) => bindEvents(e)}
          isSticky={true}
          className="md:py-[74px] py-8 z-20"
        />
        <div className="flex flex-col gap-6">
          {data.tabs.map((e: any, idx: number) => {
            return (
              <div
                ref={(el) => registerElement(idx, el)}
                key={e._key}
                data-key={e._key}
                className="flex scroll-m-[180px]  xl:flex-row flex-col gap-6 bg-white md:p-3 p-2 md:rounded-[24px] rounded-[12px]"
              >
                <div className="flex flex-col gap-1 md:p-6 p-4">
                  <h4 className="text-[#4F525A] font-geist !leading-[142%] text-sm tracking-wide md:tracking-[0.8px] uppercase">
                    {e.tabHeading}
                  </h4>
                  <p className="text-gray-[950px] font-manrope text-xl md:text-3xl md:font-bold font-semibold leading-[133.33%] tracking-normal">
                    {e.tabSubHeading}
                  </p>
                  <PortableText value={e.description} components={components} />
                </div>
                 <div className="xl:h-[476px] xl:w-[886px] h-[400px] md:rounded-[12px] rounded-[8px] overflow-clip">
                   {e.image?.url ? (
                     <ImageLoader
                       height={476}
                       width={886}
                       image={e.image.url}
                       alt={e.tabHeading || 'Tab image'}
                       className="xl:w-[886px] w-full md:h-[476px] h-[400px] object-contain"
                     />
                   ) : (
                     <div className="xl:w-[886px] w-full md:h-[476px] h-[400px] bg-gray-200 flex items-center justify-center">
                       <span className="text-gray-500">No image available</span>
                     </div>
                   )}
                 </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
