import React, { useEffect, useState, useRef } from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { PortableText } from '@portabletext/react'
import useIntersectionObserver from '~/hooks/useIntersectionObserver'

interface GroupsAndDSOProps {
  pageData: any
}

export default function GroupsAndDSO({ pageData, }: GroupsAndDSOProps) {
  const data = pageData?.['groups-and-dso']?.componentData
  const [orderedCard, setCardOrder] = useState<any>(data);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const bindEvents = (e: string) => {
    setIsScrolling(true);
    scrollToElement(e);
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set a timeout to re-enable intersection observer after scroll completes
    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);
    }, 1000); // Adjust timing as needed
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

  useEffect(() => {
    if (data?.tabs) {
      const sortedTabs = [...data.tabs].sort((a: any, b: any) => a._key.localeCompare(b._key));
      setCardOrder({ ...data, tabs: sortedTabs });
    }
  }, [data]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-zinc-700 font-inter text-sm md:text-base !leading-[150%] tracking-normal">{children}</p>
      ),
    },
  }


  return (
    <Section>
      <Container className='flex flex-col items-center'>
        <SectionHeader
          heading={data?.headline}
          description={data?.subDescription}
        />
        <SwitchableTabs
          data={data.tabs.map((e:any)=>{
            return({
              key: e._key,
              heading: e.tabHeading,
              title: e.tabHeading,
            })
          })}
          activeTab={activeTabValue}
          setActiveTab={(e: string) => bindEvents(e)}
          isSticky={true}
          className="md:py-[74px] py-8 z-20"
        />
        <div className='flex flex-col gap-6'>
          {
            data?.tabs?.map((e:any, idx:number)=>{
              return(
                <div 
                  ref={(el) => registerElement(idx, el)} 
                  key={e._key} 
                  data-key={e._key}
                  className='flex scroll-m-[180px]  xl:flex-row flex-col gap-6 bg-white md:p-3 p-2 md:rounded-[24px] rounded-[12px]'
                >
                  <div className='flex flex-col gap-1 md:p-6 p-4'>
                    <h4 className="text-[#4F525A] font-geist !leading-[142%] text-sm tracking-wide md:tracking-[0.8px] uppercase">{e.tabHeading}</h4>
                    <p className="text-gray-[950px] font-manrope text-xl md:text-3xl md:font-bold font-semibold leading-[133.33%] tracking-normal">{e.tabSubHeading}</p>
                    <PortableText value={e.description}  components={components}/>
                    </div>
                  <div className='xl:h-[476px] xl:w-[886px] h-[400px] md:rounded-[12px] rounded-[8px] overflow-clip'>
                    <ImageLoader
                      height={476}
                      width={886}
                      image={e.image.url}
                      alt={e.tabHeading}
                      className='xl:w-[886px] w-full md:h-[476px] h-[400px] object-contain'
                    />
                  </div>
                </div>
              )
            })
          }
         </div>
      </Container>
    </Section>
  )
  
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'
  const client = getClient()

  try {
    const queries = new Queries('whoWeServe', region)
    const slug = region === 'en' ? 'groups-and-dso' : `groups-and-dso-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)

    return {
      props: {
        pageData: pageData || null,
        currentLanguage: region
      },
    }
  } catch (error) {
    console.error('Error fetching groups and DSO page:', error)
    return {
      props: {
        pageData: null,
        currentLanguage: region
      },
      revalidate: 60
    }
  }
}
