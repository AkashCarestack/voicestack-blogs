import Image from 'next/image'
import React, { useState } from 'react'
import Tick from '~/components/icons/Tick'
import { urlForImage } from '~/lib/sanity.image'
import SwitchableTabs from './switchableTabs'
import SectionHeader from './sectionHeader'

export default function ListingWithTabs({
  list,
  slug,
}: {
  list: any
  slug: string
}) {
  const slugValue: string = slug
  const data: any =
    list?.content?.sections?.find((e) => e.data?.slug?.current == slugValue) ??
    list?.content?.sections?.find(
      (e:any) =>
        e.data?.globalData != null &&
        e?.data?.globalData?.slug?.current == slug,
    )
  const tabsData: any =
    data?.data?.globalData?.tabsListingComponent || data?.data
    const [activeTab, setActiveTab] = useState<string>(tabsData.tabs[0]?._key)

  return (
    <>
 
      <SwitchableTabs
        data={(tabsData?.tabs || tabsData || []).map((e: any) => ({
          tabHeading: e.tabHeading,
          key: e._key,
          title: e.tabHeading,
        }))}
        setActiveTab={(e: any) => setActiveTab(e)}
      />
      <div className="w-full">
        {(tabsData?.tabs || []).map((el: any, tabIdx: number) => (
            activeTab === el._key && (
          <div  className=" w-full grid xl:grid-cols-2 gap-6" key={el._key} >
           
            {el.listItems?.map((e: any, itemIdx: number) => (
              <div className='flex flex-row gap-4 lg:w-[606px] rounded-[24px] overflow-hidden bg-[#F4F3FA]'>
                <div key={itemIdx} className="gird grid-cols-2 items-start">
                  <div className="flex flex-col p-8">
                     <h4 className="text-gray-950 text-sm font-normal leading-normal tracking-wider uppercase mb-2">{el.tabHeading}</h4>
                   
                    <h3 className="text-gray-950 font-manrope text-2xl font-bold tracking-normal leading-[133.33%] mb-3">
                    {e.subfeatureSubheading}
                    </h3>
                    <p className="font-geist text-gray-700 text-base font-normal tracking-normal leading-normal">
                    {e.subfeatureDescription}
                  </p>
                  </div>

                 
                  <div className="w-full h-auto">
                  {e.subfeatureImage && (
                    <Image
                      width={608}
                      height={394}
                      alt={e.subfeatureSubheading || 'Feature image'}
                      src={urlForImage(e.subfeatureImage)}
                    />
                  )}
                </div>
                </div>
                
              </div>
            ))}
          </div>
            )
        ))}
      </div>
    </>
  )
}
