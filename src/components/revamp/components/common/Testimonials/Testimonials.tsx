import { isEmpty } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { PortableText } from '@portabletext/react'

import Button from '~/components/common/Button'
import { FormModal } from '~/components/common/FormModal'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { VideoItem, VideoModal } from '~/components/common/VideoModal'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import IconBadge from '../iconBadge'
import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'

export default function Testimonials({ data, refer = null }) {
  const [openForm, setOpenForm] = useState(false)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [stickyStates, setStickyStates] = useState<boolean[]>([]) // Tracks if each card is sticky
  const [activeTab, setActiveTab] = useState<string>(data?.tabs[0]?.tabHeading)
  const { isDemoPopUpShown } = useContext(BookDemoContext)
  const router = useRouter()
  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsOpen(true)
  }

  const activeTabData = data?.tabs?.find((tab) => tab.tabHeading == activeTab)

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const updatedStickyStates = data?.map((_: any, index: string | number) => {
  //       const card = cardRefs.current[index]
  //       if (card) {
  //         const rect = card.getBoundingClientRect()
  //         // Check if the card is at the top of the viewport (sticky point)
  //         return rect.top <= 200
  //       }
  //       return false
  //     })
  //     setStickyStates(updatedStickyStates)
  //   }

  //   window.addEventListener('scroll', handleScroll)

  //   // Cleanup listener on unmount
  //   return () => window.removeEventListener('scroll', handleScroll)
  // }, [data])

  if (isEmpty(data)) {
    return (
      <>
        <p>Testimonial Section is Loading...</p>
      </>
    )
  }

  const rightSectionLayout = () => {
    return (
      <div className="relative h-full md:mb-0 mb-4">

         {/* desktop */}
         <div className="relative flex-1 text-white flex w-full h-full">
          <div className="flex flex-col gap-3 py-8 px-6">
            {/* Company Logo */}
            <div className="flex flex-1">
              <div
                className=""
                style={{
                  height: `38px`,
                  width: `${
                    38 *
                    activeTabData?.testimonial?.logo?.metadata?.dimensions
                      ?.aspectRatio
                  }px`,
                }}
              >
                <ImageLoader
                  image={activeTabData?.testimonial?.logo}
                  alt="Brand Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {/* Metrics overlay */}
            <div className="flex flex-col gap-12">
              {activeTabData?.testimonial?.listItems?.length > 0 ?
              <div className="relative z-10 grid grid-cols-2  gap-y-3 gap-x-6 md:gap-x-12">
                {activeTabData?.testimonial?.listItems?.map((metric, index) => (
                  <div
                    key={index}
                    className="text-white py-3 border-b border-white/30 "
                  >
                    <div
                      className="text-lg md:text-[32px] font-semibold testimonial-metric inline font-manrope"
                      dangerouslySetInnerHTML={{
                        __html: metric?.after
                          ? metric?.after
                          : metric?.description,
                      }}
                    />
                    <div className="text-sm md:text-base text-white opacity-70">
                      {metric?.listHeading}
                    </div>
                  </div>
                ))}
              </div>
              :
              <div className="relative z-10 flex text-lg text-white">
                <div className="text-lg md:text-[32px] font-semibold leading-[120%] font-manrope">
                  {activeTabData?.testimonial?.testimonialdescription}
                </div>
                </div>
              }
              <div className="items-center gap-4 flex sm:hidden">
              <div className="relative w-14 h-14 mb-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center">
                  <ImageLoader
                    key={`testimonial-image-${activeTabData?.testimonial?._id || activeTab}`}
                    image={activeTabData?.testimonial?.testimonialImage}
                    width={56}
                    height={56}
                    imageClassName="w-full h-auto object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 text-white text-sm font-semibold z-10">
                <p className="font-semibold">
                  {activeTabData?.testimonial?.name}
                </p>
                <p className=" text-white/60">
                  {activeTabData?.testimonial?.designation}
                </p>
              </div>
            </div>

            <Button
            type="primary"
            onClick={() => {
              setOpenForm(true)
            }}
            className='w-fit'
          >
            <span className="text-base font-medium">{`Book free demo`}</span>
          </Button>
            </div>
          </div>
          <div className="relative w-full max-w-[440px]  items-end justify-end hidden sm:flex">
            <ImageLoader
              key={`testimonial-image-${activeTabData?.testimonial?._id || activeTab}`}
              image={activeTabData?.testimonial?.testimonialImage}
              imageClassName="w-full h-auto object-contain"
            />
            <div className='absolute bottom-8 right-0'>
            <div className="flex flex-col py-6 pl-6 pr-8 rounded-l-[12px] rounded-r-none bg-white/5 backdrop-blur-[20px]">
                <p className="font-medium text-lg text-white">
                  {activeTabData?.testimonial?.name}
                </p>
                <p className=" text-white/60 text-base font-normal">
                  {activeTabData?.testimonial?.designation}
                </p>
              </div>
            </div>
          </div>
          
        </div>

        {/* <div className="w-full max-w-[215px] rounded-xl bg-black/20 backdrop-blur-[10px] gap-6 p-3 md:p-8 text-white flex flex-col justify-between">
          <div className="flex flex-col gap-6 md:gap-12">
            <div className="flex flex-col gap-4 text-sm md:text-base">
              <div className="flex flex-col">
                <p className="font-semibold">
                  {activeTabData?.testimonial?.name}
                </p>
                <p className=" text-white/60">
                  {activeTabData?.testimonial?.designation}
                </p>
              </div>
              <div>
                <p className="font-semibold ">
                  {activeTabData?.testimonial?.place}
                </p>
                <p className="text-white/60">
                  {activeTabData?.testimonial?.region}
                </p>
              </div>
              <div>
                <p className="font-semibold ">
                  {activeTabData?.testimonial?.locations}
                </p>
                <p className="text-white/60">
                  {parseInt(activeTabData?.testimonial.locations) > 1
                    ? 'Locations'
                    : 'Location'}
                </p>
              </div>
            </div>
          </div>
        </div> */}
        {/* </div> */}
      </div>
    )
  }

  return (
    <Section className="relative py-sm md:py-md lg:py-lg bg-[#F9F9F9]">
      <Container className="w-full relative">
        <div className="flex flex-col items-center w-full gap-16">
          <div className="flex justify-center w-full">
            <SectionHeader
              heading={data?.subheadline}
              description={data?.subDescription}
            />
          </div>

          {/* Tab Navigation */}
          <SwitchableTabs
            isSticky={false}
            data={(data?.tabs || []).map((e: any) => ({
              key: e.tabHeading,
              title: e.tabHeading,
              setActiveTab: (key: string) => setActiveTab(key),
            }))}
            setActiveTab={(e: any) => setActiveTab(e)}
            activeTab={activeTab}
          />

          {/* Tab Content */}
          <div className="flex w-full gap-8 z-10 relative">
            <div className="w-full relative rounded-[12px] md:rounded-[24px] overflow-hidden min-h-[504px]">
              <div className="flex flex-col lg:flex-row w-full h-full">
                <Image
                  src="/assets/Bg/BG01.png"
                  alt={activeTabData?.tabHeading}
                  width={600}
                  height={600}
                  className="w-full h-full object-cover absolute left-0 right-0 top-0 bottom-0 z-0"
                />
                <div className="w-full flex flex-col lg:flex-row gap-3">
                   {/* Left Panel - Description */}
                   <div className="p-3 z-10 lg:max-w-[320px] w-full h-full flex">
                     <div className="bg-[#F4F3FA] hover:bg-[#F0EFFA] transition-all duration-300 ease-in-out rounded-[12px] md:rounded-[24px] p-6 flex-1 cursor-pointer">
                      <div className="group flex flex-col gap-6 justify-between h-full">
                        <IconBadge icon={activeTabData?.icon} />
                        <div className="flex flex-col gap-6 items-start ">
                          <div className="">
                            <h3 className="text-base md:text-lg font-bold text-gray-950 mb-4 font-manrope">
                              {activeTabData?.tabHeading}
                            </h3>
                            <div className="text-gray-700 leading-relaxed text-sm md:text-base">
                              {activeTabData?.description && (
                                <PortableText value={activeTabData.description} />
                              )}
                            </div>
                          </div>
                          <Button type="underline">Learn More</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                   {/* Right Panel - Testimonial */}
                   <div className="max-w-[956px] w-full flex-1">
                     {rightSectionLayout()}
                   </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* comment test */}
        {isOpen && (
          <VideoModal
            refer={refer}
            isPopup={true}
            videoDetails={selectedVideo}
            className={`pt-9 z-30 flex items-start`}
            onClose={() => setIsOpen(false)}
            openForm={() => setOpenForm(true)}
            hasDemoBanner={true}
          />
        )}
        {openForm && (
          <FormModal
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
            data={isDemoPopUpShown}
          />
        )}
      </Container>
    </Section>
  )
}
