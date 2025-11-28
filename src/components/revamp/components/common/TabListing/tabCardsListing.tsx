import React, { useRef, useState, useEffect } from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver'
import { PortableText } from '@portabletext/react'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Button from '~/components/common/Button'

export default function TabCardsListing({ data }: { data: any }) {
  const [isScrolling, setIsScrolling] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileActiveTab, setMobileActiveTab] = useState<string>('')
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // md breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Set initial mobile active tab
  useEffect(() => {
    if (isMobile && data?.tabs && data.tabs.length > 0) {
      // If switching to mobile or mobileActiveTab is empty, set to first tab
      if (!mobileActiveTab || !data.tabs.find((tab: any) => tab._key === mobileActiveTab)) {
        setMobileActiveTab(data.tabs[0]._key || '')
      }
    }
  }, [isMobile, data?.tabs, mobileActiveTab])

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
    if (isMobile) {
      // On mobile, just update the active tab state (no scrolling)
      setMobileActiveTab(e)
    } else {
      // On desktop, scroll to element
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
  }

  const {
    activeElement: activeTabValue,
    scrollToElement,
    registerElement,
  } = useIntersectionObserver({
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    rootMargin: '-10% 0px -10% 0px',
    minScore: 0.8,
    enabled: !isScrolling && !isMobile, // Disable during programmatic scrolling and on mobile
  })

  // Determine which tab is active (mobile uses manual selection, desktop uses intersection observer)
  // Fallback to first tab if no active tab is set
  const getCurrentActiveTab = () => {
    if (isMobile) {
      return mobileActiveTab || (data?.tabs?.[0]?._key || '')
    } else {
      return activeTabValue || (data?.tabs?.[0]?._key || '')
    }
  }
  const currentActiveTab = getCurrentActiveTab()

  return (
    <Section className="py-sm md:py-md lg:py-lg">
      <Container className="flex flex-col items-center">
        <SectionHeader
          heading={data?.headline}
          description={data?.subDescription}
        />
        {data?.tabs && data?.tabs?.length && (
          <SwitchableTabs
            data={
              data.tabs && Array.isArray(data.tabs) ? data.tabs.map((e: any) => {
                return {
                  key: e._key,
                  heading: e.tabHeading,
                  title: e.tabHeading,
                }
              }) : []
            }
            activeTab={currentActiveTab}
            setActiveTab={(e: string) => bindEvents(e)}
            isSticky={!isMobile}
            className="md:py-[74px] py-8 z-20"
          />
        )}
        <div className="flex flex-col md:gap-[180px] gap-[60px]">
          {data?.tabs && Array.isArray(data.tabs) && data.tabs
            .filter((e: any) => {
              // On mobile, show only the active tab. On desktop, show all tabs
              return isMobile ? (e._key === currentActiveTab) : true
            })
            .map((e: any, idx: number) => {
            // Find the original index for intersection observer registration
            const originalIdx = data.tabs.findIndex((tab: any) => tab._key === e._key)
            return (
              <div
                ref={(el) => {
                  // Only register elements on desktop (for intersection observer)
                  if (!isMobile) {
                    registerElement(originalIdx, el)
                  }
                }}
                key={e._key}
                data-key={e._key}
                className="flex scroll-m-[180px]  xl:flex-row flex-col gap-6 bg-white md:p-3 p-2 md:rounded-[24px] rounded-[12px]"
              >
                <div className="flex flex-col gap-1 md:p-6 p-4 flex-1 justify-between order-2 xl:order-1">
                    <div className="flex flex-col gap-1">
                  <h4 className="text-[#4F525A] font-geist !leading-[142%] text-sm tracking-wide md:tracking-[0.8px] uppercase">
                    {e.tabHeading}
                  </h4>
                  <p className="text-gray-[950px] font-manrope [&_br]:hidden md:[&_br]:block text-xl md:text-3xl md:font-bold font-semibold leading-[133.33%] tracking-normal" style={{
                    wordBreak: 'keep-all',
                    overflowWrap: 'normal',
                    hyphens: 'none'
                  }} dangerouslySetInnerHTML={{__html: e.tabSubHeading}}>
                    
                  </p>
                  <PortableText value={e.description} components={components} />
                  </div>
                  <div className='md:py-0 py-4 md:w-[172px]'>
                    {
                        e?.ctaListItems && Array.isArray(e.ctaListItems) && e.ctaListItems.map((item: any, idx: any) => {
                            return (
                                <Button key={idx} className='text-black' type={'primary'} link={item.ctaLink} target="_blank"><span>{item?.ctaText}</span></Button>
                            )
                        })
                    }
                   
                  </div>
                </div>
                <div className="xl:h-[476px]  h-[400px] md:rounded-[12px] rounded-[8px] overflow-hidden flex-none order-1 md:order-2"> 
                  <ImageLoader
                    height={476}
                    width={886}
                    image={e.image?.url}
                    alt={e.tabHeading}
                    title={e.tabHeading}
                    className="xl:w-[800px] w-full md:h-[476px] h-[400px] object-contain"
                  />
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
