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
      <p className="text-zinc-950 font-manrope text-3xl font-bold leading-[133.33%] tracking-normal py-1">
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

export default function ListingWithTabs({ list }: { list: any }) {
  const [switchButtonValue, setSwitchButtonValue] = useState<any[]>([])

  useEffect(() => {
    if (
      list.componentType === 'TabsListing' &&
      list.componentData?.refData?.tabsListingComponent?.tabs
    ) {
      const tabs = list.componentData.refData.tabsListingComponent.tabs.map(
        (e: any) => ({
          key: e._key,
          heading: e.tabHeading,
          title: e.tabHeading,
        }),
      )
      setSwitchButtonValue(tabs)
    }
  }, [list])

  const tabsData: any = list.componentData.refData.tabsListingComponent

  const [activeTabValue, setActiveTabValue] = useState<string>(
    tabsData?.tabs?.[0]?._key,
  )

  const ref = useRef<HTMLDivElement>(null)

  function bindEvents(e: string) {
    setActiveTabValue(e)
    ref.current?.scrollIntoView({ behavior: 'smooth' })
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
        <div className="w-full flex flex-col gap-[180px] ">
          {tabsData?.tabs?.map((element: any) => {
            return (
              <div className="flex flex-row gap-4 md:p-3 p-2 bg-white">
                <div className="w-full h-full rounded-[12px] overflow-auto flex flex-row gap-6">
                  <ImageLoader
                    className="md:max-w-[489px] md:h-[616px] object-contain"
                    image={urlForImage(element.image)}
                  />
                  <div className="w-full h-auto p-6 flex flex-col">
                    <div className="text-gray-950 text-sm leading-[142%] tracking-[0.8ox] uppercase">
                      {element.tabSubHeading}
                    </div>

                    {element.description && (
                      <PortableText
                        value={element.description}
                        components={components}
                      />
                    )}
                    <div className="flex flex-col justify-between flex-grow">
                      <div className="flex flex-col">
                        {element.listItems?.map((item: any) => {
                          return (
                            <div className="py-3.5 border-b border-[#E6E7E8]">
                              <h4 className="text-gray-950 text-base font-medium leading-normal tracking-normal">
                                {item.subfeatureHeading}
                              </h4>
                              <h5 className="text-gray-600 font-base font-medium leading-normal tracking-normal">
                                {item.subfeatureDescription}
                              </h5>
                            </div>
                          )
                        })}
                      </div>
                      <div>
                        {element.ctaListItems.map((btn: any) => {
                          return (
                            <Button type={btn?.ctaType || 'primary'}>
                              <span>{btn.ctaText}</span>
                            </Button>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div></div>
              </div>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}
