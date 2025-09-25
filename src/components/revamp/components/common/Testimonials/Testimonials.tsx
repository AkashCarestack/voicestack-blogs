import { isEmpty } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useRef, useState } from 'react'

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
  console.log(data, 'data')
  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsOpen(true)
  }

  const activeTabData = data?.tabs?.find((tab) => tab.tabHeading == activeTab)
  console.log(activeTab, activeTabData, 'activeTabData')

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
      <div className="relative md:h-full md:min-h-[450px] md:mb-0 mb-4 rounded-[18px] overflow-hidden">
        <div className="w-full h-full bg-gradient-to-r from-[#CAC5FF] to-[#4A3CE1] flex left-0 right-0 top-0 bottom-0 absolute" />

        {/* mobile */}
        <div className="relative md:absolute flex flex-col md:flex-row bottom-0 w-full h-full md:hidden text-white p-3">
          <Image
            src="/assets/testimonialbg.png"
            alt={activeTabData?.tabHeading}
            width={600}
            height={600}
            className="w-full h-full object-cover absolute left-0 right-0 top-0 bottom-0"
          />
          <div className="flex flex-col py-8 px-4 gap-8">
            {/* Company Logo */}
            <div className="flex">
              <div className="w-20 h-10 bg-white rounded flex items-center justify-center">
                <div className="w-32 h-8 flex items-center justify-center">
                  <ImageLoader
                    image={activeTabData?.testimonial?.logo}
                    fixed={false}
                    imageClassName="h-auto w-auto"
                  />
                </div>
              </div>
            </div>

            {/* Metrics Display */}
            <div className="flex z-10">
              {activeTabData?.testimonial?.listItems?.map((metric, index) => (
                <div key={index} className="text-white border-r border-white/10 px-4 last:border-none">
                  <div
                    className="text-xl font-semibold testimonial-metric inline"
                    dangerouslySetInnerHTML={{
                      __html: metric?.after
                        ? metric?.after
                        : metric?.description,
                    }}
                  />
                  <div className="text-xs text-white">
                    {metric?.listHeading}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4">
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
          </div>
          <div className="w-full bg-white/10 backdrop-blur-md py-8 px-4 text-white flex flex-col justify-between flex-1 gap-6">
            <div className="flex gap-12">
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
                  {/* {activeTabData?.testimonial.locations?.includes('+') || */}
                  {parseInt(activeTabData?.testimonial.locations) > 1
                    ? 'Locations'
                    : 'Location'}
                </p>
              </div>
            </div>
            <Button className="bg-[#C8F46E] text-tiber-950 text-base font-medium px-6 py-3 rounded-md border-none">
              Book Free Demo
            </Button>
          </div>
        </div>

        {/* desktop */}
        <div className="absolute md:flex flex-col md:flex-row bottom-0 w-full h-full hidden p-3 gap-3">
          <div className="relative flex-1 text-white flex w-full items-end h-full rounded-[12px] overflow-hidden">
            <Image
              src="/assets/testimonialbg.png"
              alt={activeTabData?.tabHeading}
              width={600}
              height={600}
              className="w-full h-full object-cover absolute left-0 right-0 top-0 bottom-0"
            />

            {/* Metrics overlay */}
            <div className="relative z-10 flex flex-col  p-4 md:p-8 flex-1">
              {activeTabData?.testimonial?.listItems?.map((metric, index) => (
                <div
                  key={index}
                  className="text-white pt-5 pb-5 border-t border-white/10 first:border-none last:pb-0"
                >
                  <div
                    className="text-3xl font-bold testimonial-metric inline"
                    dangerouslySetInnerHTML={{
                      __html: metric?.after
                        ? metric?.after
                        : metric?.description,
                    }}
                  />
                  <div className="text-base text-white">
                    {metric?.listHeading}
                  </div>
                </div>
              ))}
            </div>
            <div className="relative w-full max-w-[302px] h-[410px] flex flex-1 items-end justify-end">
              <ImageLoader
                key={`testimonial-image-${activeTabData?.testimonial?._id || activeTab}`}
                image={activeTabData?.testimonial?.testimonialImage}
                imageClassName="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="w-full max-w-[215px] rounded-xl bg-black/20 backdrop-blur-[10px] gap-6 p-3 md:p-8 text-white flex flex-col justify-between">
            {/* Company Logo */}
            <div className="flex">
              <div className="w-32 h-8 flex items-center justify-center">
                <ImageLoader
                  image={activeTabData?.testimonial?.logo}
                  fixed={false}
                  imageClassName="h-auto w-auto"
                />
              </div>
            </div>

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
                    {/* {activeTabData?.testimonial.locations.includes('+') || */}
                    {parseInt(activeTabData?.testimonial.locations) > 1
                      ? 'Locations'
                      : 'Location'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Section className="relative py-12 md:py-24 bg-[#F9F9F9]">
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
            <div className="w-full relative">
              <div className="flex flex-col lg:flex-row w-full gap-3">
                {/* Left Panel - Description */}
                <div className="max-w-[292px] w-full bg-[#F4F3FA] hover:bg-[#F0EFFA] transition-all duration-300 ease-in-out rounded-[24px] p-7">
                  <div className="group flex flex-col gap-6 justify-between h-full">
                    <IconBadge icon={activeTabData?.icon} />
                    <div className="flex flex-col gap-6 items-start ">
                      <div className="">
                        <h3 className="text-base md:text-lg font-bold text-gray-950 mb-4 font-manrope">
                          {activeTabData?.tabHeading}
                        </h3>
                        <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                          {activeTabData?.description}
                        </p>
                      </div>
                      <Button type="underline">Learn More</Button>
                    </div>
                  </div>
                </div>

                {/* Right Panel - Testimonial */}
                <div className="max-w-[936px] w-full">
                  {rightSectionLayout()}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Button
              type="primary"
              className="w-fit"
              onClick={() => {
                setOpenForm(true)
              }}
            >
              <span>
                Book Free Demo
              </span>
            </Button>
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
