import React, { useState } from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { urlForImage } from '~/lib/sanity.image'
import Image from 'next/image'
import Button from '~/components/common/Button'

export default function SingleTabCardListing({ data }: { data: any }) {
    console.log({data})
    const [activeTab, setActiveTabValue] = useState<any>(data?.tabs?.[0]?._key || '')
  return (
    <Section className='py-sm md:py-md lg:py-lg'>
        <Container className='flex flex-col items-center'>
            <SectionHeader
                heading={data?.headline}
                description={data?.subDescription}
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
                                <div className='flex xl:flex-row flex-col gap-6 bg-white p-3 h-auto md:rounded-[24px] rounded-[12px] xl:h-[472px]' key={ele._key}>
                                    <div className='xl:w-[596px] w-full  bg-[#EEEDFF] flex-shrink-0 rounded-[12px] overflow-hidden relative'>
                                        {ele?.image?.url && (
                                            <Image 
                                                
                                                className='object-cover rounded-[12px]' 
                                                src={ele?.image?.url || urlForImage(ele.image)} 
                                                width={596} 
                                                height={427} 
                                                alt={ele.tabHeading}
                                                style={{ width: '100%', height: '100%' }}
                                            />
                                        )}
                                    </div>
                                    <div className='grid xl:grid-cols-2 grid-cols-1  md:p-6 p-4 xl:gap-0 gap-5'>
                                        {
                                            ele?.listItems && Array.isArray(ele.listItems) && ele.listItems.map((item:any)=>{return(
                                                <div key={item._key} className="xl:px-4 xl:py-4 px-2 py-2 relative flex flex-col items-start gap-4 xl:min-h-[212px]">
                                                    <div className='md:px-6 md:py-3 px-4 py-2 bg-[#E5E7EB] rounded-full flex items-center justify-center flex-shrink-0'>
                                                        <div dangerouslySetInnerHTML={{__html:item.svgCode}}></div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-gray-500 font-geist text-base font-medium leading-[155%]">{item.subfeatureHeading}</div>
                                                        <div className="text-gray-500  text-sm leading-[150%] font-normal">{item.subfeatureDescription}</div>
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
                <div className='flex justify-center md:pt-16 pt-8'>
                    <Button type='primary' link={'/demo'} target='_self'><span>{'Book Free Demo'}</span></Button>
                </div>
            </div>

        </Container>
    </Section>
  )
}
