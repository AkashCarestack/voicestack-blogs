import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import ClickableCards from '~/components/revamp/components/common/ClickableCards'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs'
import { useIntersectionObserver } from '~/hooks/useIntersectionObserver'

export default function CustomerStories({pageData}: any) {
    const [tabsData, setTabsData] = useState<any[]>([])
    const data = pageData?.['Powering-Startup']?.componentData

    // Use the intersection observer hook
    const { 
        activeElement: activeCard, 
        scrollToElement: scrollToCard, 
        registerElement: registerCard 
    } = useIntersectionObserver({
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
        rootMargin: '-20% 0px -20% 0px',
        minScore: 0.3,
        debug: process.env.NODE_ENV === 'development'
    })

    // Create tabs from card data
    useEffect(() => {
        if (data?.items) {
            const tabs = data.items.map((item: any, index: number) => ({
                key: item._key || `card-${index}`,
                heading: item.heading,
                title: item.heading,
            }))
            setTabsData(tabs)
        }
    }, [data])

    // Handle tab click
    const handleTabClick = (tabKey: string) => {
        scrollToCard(tabKey)
    }

    if (!data) {
        return <div>Loading...</div>
    }

    return (
        <Section className="flex-col md:gap-[32px] gap-6 py-sm md:py-md lg:py-lg">
            <SectionHeader
                heading={data?.heading}
                description={data?.description}
            />
            
            {/* Tabs Navigation */}
            {tabsData.length > 0 && (
                <SwitchableTabs
                    data={tabsData}
                    setActiveTab={handleTabClick}
                    isSticky={true}
                    activeTab={activeCard}
                    className="md:py-[74px] py-8 z-20"
                />
            )}
            
            {/* Cards with viewport tracking */}
            <div className="w-full">
                <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {data?.items?.map((item: any, index: number) => (
                        <div 
                            key={item._key || index}
                            data-card-key={item._key || `card-${index}`}
                            ref={(el) => registerCard(index, el)}
                            className="md:p-3 p-2 flex flex-col gap-3"
                        >
                            <div className="md:w-[373px] w-full h-[200px] md:rounded-[12px] rounded-[8px] overflow-hidden">
                                <img
                                    className="w-full h-full object-cover"
                                    src={item.image?.asset?.url}
                                    alt={item.heading}
                                />
                            </div>
                            <div className="flex flex-col gap-2 p-2">
                                <div className="md:p-3 flex flex-col md:gap-2 gap-1.5">
                                    <h4 className="md:text-2xl text-xl font-bold font-manrope text-gray-950 leading-[133.33%] md:pb-1">
                                        {item.heading}
                                    </h4>
                                    <p className="md:text-base text-sm font-normal font-geist text-gray-700 leading-[150%]">
                                        {item.description}
                                    </p>
                                    {item.link?.url && (
                                        <div>
                                            <Button
                                                href={item.link.url}
                                                text={item.link.text}
                                                type="underline"
                                            >
                                                {item.link.text}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className='flex justify-center'>
                <Button className='w-fit' type='primary' link='/dental-phones/customer-stories'>
                    <span>Book Free Demo</span>
                </Button>
            </div>
        </Section>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'
  const client = getClient()

  try {
    const queries = new Queries('dentalPhones', region)
    const slug = region === 'en' ? 'customer-stories' : `customer-stories-${region.toLowerCase()}`
    const pageData = await queries.getPageData('dentalPhones', slug)

    return {
      props: {
        pageData: pageData || null
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return {
      props: {
        pageData: null
      },
      revalidate: 60
    }
  }
}
