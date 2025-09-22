import Image from 'next/image';
import React from 'react'
import Tick from '~/components/icons/Tick';
import { urlForImage } from '~/lib/sanity.image';

export default function ListingWithTabs({list ,slug}: {list: any,slug: string}) {
    const slugValue :string= slug;
    const data:any = list?.content?.sections?.find(e=>e.data?.slug?.current == slugValue) ??
     list?.content?.sections?.find(e=>e.data?.globalData!= null && e?.data?.globalData?.slug?.current == slug);
    const tabsData:any = data?.data?.globalData?.tabsListingComponent || data?.data
    console.log({list},{data},{tabsData})
  return (
    <>
    <h1>Listing with Tabs</h1>
    <div className='grid grid-cols-2 gap-4 w-full'>
        {
            tabsData?.tabs?.map((el: any, tabIdx: number) => (
                <div key={tabIdx} className='bg-[#F4F3FA]'>
                    
                    <h4 className='text-2xl font-bold'>{el.tabHeading}</h4>
                    {/* {console.log(el)} */}
                    {
                        el.listItems?.map((e: any, itemIdx: number) => (
                            <><div key={itemIdx} className='flex flex-col gap-2 items-start'>
                               <div className='flex flex-row gap-2'> <Tick width={16} height={17} /> <h3 className='text-gray-950 font-manrope text-2xl font-bold tracking-normal leading-[133.33%]'>{e.subfeatureSubheading}</h3></div>

                                <p className='font-geist text-gray-700 text-base font-normal tracking-normal leading-normal'>{e.subfeatureDescription}</p>
                            </div>
                            <div className='w-full h-auto'>
                       
                        {e.subfeatureImage && <Image width={608} height={394} alt={e.subfeatureSubheading || 'Feature image'} src={urlForImage(e.subfeatureImage)} />}
                     </div>
                            </>
                        ))
                    }
                  
                </div>
            ))
        }
    </div>
  
    </>
  )
}
