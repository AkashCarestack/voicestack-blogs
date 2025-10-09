import Image from 'next/image'
import React, { useRef, useState, useEffect } from 'react'
import { urlForImage } from '~/lib/sanity.image'
import SwitchableTabs from './switchableTabs'
import useMediaQuery from '~/utils/mediaQuery'
import Container from '~/components/structure/Container'
import { PortableText } from '@portabletext/react'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'

const components: any = {
  block: {
    normal: ({ children }: { children: React.ReactNode }) => (
      <p className="text-zinc-950 font-manrope md:text-3xl text-xl font-bold leading-[133.33%] tracking-normal py-1">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }: { children: React.ReactNode }) => (
      <strong className="text-gray-950">{children}</strong>
    ),
  },
}

const TickMark = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13.363 3.32248C13.4259 3.37018 13.4787 3.4298 13.5184 3.49794C13.5582 3.56607 13.5841 3.64138 13.5948 3.71955C13.6054 3.79772 13.6005 3.87722 13.5804 3.9535C13.5602 4.02977 13.5252 4.10133 13.4774 4.16408L7.07743 12.5641C7.02552 12.6321 6.95965 12.6883 6.88424 12.7288C6.80884 12.7692 6.72565 12.7931 6.64025 12.7988C6.55486 12.8045 6.46923 12.7918 6.38913 12.7617C6.30903 12.7316 6.2363 12.6846 6.17583 12.6241L2.57583 9.02408C2.46984 8.91034 2.41215 8.7599 2.41489 8.60446C2.41763 8.44902 2.4806 8.30071 2.59053 8.19078C2.70046 8.08085 2.84877 8.01788 3.00421 8.01513C3.15965 8.01239 3.31009 8.07009 3.42383 8.17608L6.53903 11.2905L12.523 3.43688C12.6193 3.31044 12.7619 3.22738 12.9194 3.20593C13.0769 3.18448 13.2364 3.2264 13.363 3.32248Z" fill="#030712"/>
  </svg>
  )
}

export default function ListingWithTabs({ list }: { list: any }) {
  const [switchButtonValue, setSwitchButtonValue] = useState<any[]>([])

  useEffect(() => {
      const tabs = list.componentData.refData.tabsListingComponent.tabs.map(
        (e: any) => ({
          key: e._key,
          heading: e.tabHeading,
          title: e.tabHeading,
        }),
      )
      setSwitchButtonValue(tabs)
  }, [list])

  const tabsData: any = list.componentData.refData.tabsListingComponent

  const [activeTabValue, setActiveTabValue] = useState<string>(
    tabsData?.tabs?.[0]?._key,
  )

  const refElement = useRef<(HTMLDivElement | null)[]>([])

  function bindEvents(e: string) {
    setActiveTabValue(e)
    // Find the element with the matching key and scroll to it
    const targetElement = refElement.current.find(el => el?.getAttribute('data-key') === e)
    targetElement?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Section className="py-sm md:py-md lg:py-lg bg-[#F9F9F9] ">
      <Container className="flex-col">
        <SwitchableTabs
          data={switchButtonValue}
          setActiveTab={(e: string) => bindEvents(e)}
          isSticky={true}
          activeTab={activeTabValue}
          className="py-[74px] z-50"
        />
        <div className="w-full flex flex-col md:gap-[180px] gap-6 ">
           {tabsData?.tabs?.map((element: any, idx: number) => {
             return (
               <div 
                 className="flex flex-row gap-4 md:p-3 bg-white" 
                 key={element._key}
                 data-key={element._key}
                 ref={(el) => {
                   refElement.current[idx] = el
                 }}
               >
                <div className="w-full h-full rounded-[12px] overflow-auto flex lg:flex-row flex-col gap-6">
                  <ImageLoader
                    className="md:max-w-[489px] md:h-[616px] h-[300px] object-contain"
                    image={urlForImage(element.image)}
                  />
                  <div className="w-full h-auto md:p-6 p-4 flex flex-col">
                    <div className="text-gray-950 md:text-sm text-xs leading-[142%] tracking-[0.8px] uppercase">
                      {element.tabSubHeading}
                    </div>

                    {element.description && (
                      <PortableText
                        value={element.description}
                        components={components}
                      />
                    )}
                    <div className="flex flex-col justify-between flex-grow md:gap-12 gap-8">
                      <div className="flex flex-col">
                        {element.listItems?.map((item: any,key:any) => {
                          return (
                            <div key={key} className="flex flex-row gap-2 py-3.5 border-b border-[#E6E7E8]">
                              <span className="py-1"><TickMark /></span>
                            <div className="">
                              <h4 className="text-gray-950 text-base font-medium leading-normal tracking-normal">
                                {item.subfeatureHeading}
                              </h4>
                              <h5 className="text-gray-600 md:text-base text-sm font-medium leading-normal tracking-normal">
                                {item.subfeatureDescription}
                              </h5>
                            </div>
                            </div>
                          )
                        })}
                      </div>
                      <div>
                        {element.ctaListItems.map((btn: any,key:any) => {
                          return (
                            <Button key={btn.ctaText+key} type={btn?.ctaType || 'primary'}>
                              <span>{btn.ctaText}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
