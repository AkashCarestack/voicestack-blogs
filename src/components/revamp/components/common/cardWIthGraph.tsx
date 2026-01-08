import React from 'react'
import Container from '~/components/structure/Container'
import Image from 'next/image'
import CardItemComponent from '../../../../v2/components/common/CardItem'
import Section from '~/components/structure/Section'
import SectionHeaderV2 from '../../../../v2/components/common/sectionHeaderV2'
import GroupedCardsGrid from '~/v2/components/GroupedCardsGrid'
import {
  PhoneOutgoingIcon,
  LockIcon,
  PhoneMissedIcon,
  Globe2Icon,
  GlobeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Settings,
  Grip,
} from 'lucide-react'
import VoicestackLogoSm from 'public/assets/voicestack-logo-sm.svg'
import DashIconWrap from './dashIconWrap'

export default function cardWIthGraph({ data }: { data: any }) {
  const borderClasses =
    'border-t md:border-r md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(3n)]:border-r-0'

  return (
    <Section className="bg-[#ffffff]" border="b">
      <Container
        className="w-full pt-sm md:pt-md lg:pt-lg"
        type="V2"
        border="y-0"
      >
        <div className="flex-col relative w-full flex gap-16">
          <SectionHeaderV2
            className="xl:px-12 md:px-6 px-4"
            heading={data?.sectionHeadingDynamic || ''}
            // heading={pageData['how-voicestack-works2']?.componentData?.heading}
            description={data?.description || ''}
          />
          <div>
            <div className="w-full">
              {/* <Image src="/assets/events/graph.png" width={646} height={247} alt="graph" /> */}
              {/* <div className='grid md:grid-cols-3'>
              {data?.items?.map((ele:any)=>{
                return (
                  <div key={ele._key || Math.random()} className={`first:col-span-2 ${borderClasses}`}>
                    <CardItemComponent item={ele} key={ele._key} />
                  </div>
                )
              })}
            </div> */}
              <div className="max-w-[1027px] w-full m-auto border-x border-gray-200 rounded-t-xl">
                <div className="border-t border-gray-200 rounded-t-xl bg-gray-50 ">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 px-4 py-4">
                      <span className="size-3 rounded-full  bg-red-500"></span>
                      <span className="size-3 rounded-full  bg-yellow-500"></span>
                      <span className="size-3 rounded-full  bg-green-500"></span>
                    </div>
                    <div className="w-full justify-center flex">
                      <div className="flex items-center gap-2 bg-white border border-gray-200 text-sm font-medium text-gray-600 rounded-full w-full max-w-sm leading-none py-2 px-3">
                        <LockIcon className="size-3" />
                        <p>id.voicestack.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex">
                    <div className="flex flex-col gap-2 border-r border-gray-200 bg-gray-50  justify-between">
                      <div className="flex flex-col ">
                        <div className="flex items-center justify-center px-2 py-3 border-b border-t border-gray-200 ">
                          <Image
                            src={VoicestackLogoSm}
                            alt="search-bar"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="flex items-center justify-center px-2 py-3 text-vs-blue/60">
                          <div className="border rounded-full border-vs-blue/40 p-1">
                            <Grip className="size-4" />
                          </div>
                        </div>
                        <DashIconWrap>
                          <PhoneOutgoingIcon className="size-5" />
                        </DashIconWrap>
                        <DashIconWrap>
                          <PhoneMissedIcon className="size-5" />
                        </DashIconWrap>
                        <DashIconWrap>
                          <GlobeIcon className="size-5" />
                        </DashIconWrap>
                      </div>

                      <div>
                        <DashIconWrap>
                          <Settings className="size-5" />
                        </DashIconWrap>
                        <DashIconWrap>
                          <LogOutIcon className="size-5" />
                        </DashIconWrap>
                      </div>
                    </div>
                    <GroupedCardsGrid
                      customListingItems={data?.items}
                      theme={'light'}
                      simpleListingData={true}
                      columnCount={3}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
