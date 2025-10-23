import React, { useEffect, useState } from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import SwitchableTabs from '~/components/revamp/components/common/switchableTabs'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { PortableText } from '@portabletext/react'

interface GroupsAndDSOProps {
  pageData: any
}

export default function GroupsAndDSO({ pageData, }: GroupsAndDSOProps) {
  const data = pageData?.['groups-and-dso']?.componentData
  const [orderedCard, setCardOrder] = useState<any>(data);
  const [activeTabValue, setActiveTabValue] = useState<string>('')
  
  const bindEvents = (e: string) => {
    setActiveTabValue(e);
    console.log('Tab clicked:', e);
    
    if (!data?.tabs) return;
    
    // Move the clicked tab to the front
    const sortedTabs = [...data.tabs].sort((a: any, b: any) => {
      if (a._key === e) return -1; // Move clicked tab to front
      if (b._key === e) return 1;
      return a._key.localeCompare(b._key); // Keep original order for others
    });
    
    setCardOrder({ ...data, tabs: sortedTabs });
  }
  
  useEffect(() => {
    if (data?.tabs) {
      const sortedTabs = [...data.tabs].sort((a: any, b: any) => a._key.localeCompare(b._key));
      setCardOrder({ ...data, tabs: sortedTabs });
    }
  }, [data]);
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
          description={data?.subHeading}
        />
        <SwitchableTabs
          data={data.tabs.map((e:any)=>{
            return({
              key: e._key,
              heading: e.tabHeading,
              title: e.tabHeading,
            })
          })}
          setActiveTab={(e: string) => bindEvents(e)}
          isSticky={true}
          activeTab={activeTabValue}
          className="md:py-[74px] py-8 z-20"
        />
        <div className='flex flex-col gap-6'>
          {
            orderedCard?.tabs?.map((e:any)=>{
              return(
                <div key={e._key} className='flex  xl:flex-row flex-col gap-6 bg-white md:p-3 p-2 md:rounded-[24px] rounded-[12px]'>
                  <div className='flex flex-col gap-1 md:p-6 p-4'>
                    <h4 className="text-[#4F525A] font-geist !leading-[142%] text-xl tracking-wide md:tracking-[0.8px] uppercase">{e.tabHeading}</h4>
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
    console.log({slug})
    
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
