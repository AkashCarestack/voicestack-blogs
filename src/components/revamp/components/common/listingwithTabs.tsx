import React from 'react'
import { urlForImage } from '~/lib/sanity.image';

export default function ListingWithTabs({list ,slug}: {list: any,slug: string}) {
    const slugValue :string= slug;
    const data:any = list.content.sections.find(e=>e.data?.slug?.current == slugValue) ??
     list?.content?.sections?.find(e=>e.data?.globalData!= null && e?.data?.globalData?.slug?.current == slug);
    const tabsData:any = data?.data?.globalData?.tabsListingComponent
    console.log({list},{data},{tabsData})
  return (
    <>
    <h1>Listing with Tabs</h1>
    <div className='flex flex-row gap-4 w-full'>
 
    </div>
  
    </>
  )
}
