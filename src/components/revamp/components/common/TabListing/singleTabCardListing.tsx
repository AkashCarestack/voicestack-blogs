import React, { useState } from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { urlForImage } from '~/lib/sanity.image'
import Image from 'next/image'

export default function SingleTabCardListing({ data }: { data: any }) {
    console.log({data})
    const [activeTab, setActiveTabValue] = useState<any>(data?.tabs?.[0]?._key || '')
  return (
    <Section className='py-sm md:py-md lg:py-lg'>
        <Container className='flex flex-col items-center'>
            <SectionHeader
                heading={data?.headline}
            />
            <SwitchableTabs
                data={data?.tabs && Array.isArray(data.tabs) ? data.tabs.map((e:any)=>{return {key:e._key, heading:e.tabHeading, title:e.tabHeading}}) : []}
                setActiveTab={(e)=>setActiveTabValue(e)}
                activeTab={activeTab}
                isSticky={false}
                className="md:py-[74px] py-8 z-20"
           
            />
            <div>
                {
                    data?.tabs && Array.isArray(data.tabs) && data.tabs.map((ele:any)=>{
                        return(
                            activeTab == ele._key && (
                                <div className='flex md:flex-row flex-col gap-6 bg-white p-3 h-auto md:rounded-[24px] rounded-[12px]' key={ele._key}>
                                    <div className='md:w-[596px] w-full  bg-[#EEEDFF] flex-shrink-0 rounded-[12px] overflow-hidden relative'>
                                        {ele?.image && (
                                            <Image 
                                                className='object-contain rounded-[12px]' 
                                                src={urlForImage(ele.image)} 
                                                width={596} 
                                                height={427} 
                                                alt={ele.tabHeading}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        )}
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 p-6'>
                                        {
                                            ele?.listItems && Array.isArray(ele.listItems) && ele.listItems.map((item:any)=>{return(
                                                <div key={item._key} className="px-4 py-6 relative flex flex-col items-start gap-4 md:w-[242px]">
                                                    <div className='px-6 py-3 bg-[#E5E7EB] rounded-full flex items-center justify-center flex-shrink-0'>
                                                        <div dangerouslySetInnerHTML={{__html:item.svgCode}}></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-gray-500 font-geist text-lg font-medium leading-[155%]">{item.subfeatureHeading}</div>
                                                        <div className="text-gray-500 font-base leading-[150%] font-normal">{item.subfeatureDescription}</div>
                                                    </div>
                                                </div>
                                            )})
                                            
                                        }
                                    
                                    </div>
                                </div>
                            )
                        )
                    })
                }
            </div>

        </Container>
    </Section>
  )
}
