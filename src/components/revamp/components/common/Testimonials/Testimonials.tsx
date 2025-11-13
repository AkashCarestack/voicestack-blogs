import { PortableText } from '@portabletext/react'
import { isEmpty } from 'lodash'
import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { VideoItem, VideoModal } from '~/components/common/VideoModal'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import IconBadge from '../iconBadge'
import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'
import TestimonialRightCard from '../testimonialRightCard'

export default function Testimonials({ data, refer = null }) {

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-xl md:text-[32px] font-medium leading-[40px] font-manrope">
          &ldquo;{children}&rdquo;
        </p>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="text-xl md:text-[32px] font-medium leading-[40px] font-manrope">
          &ldquo;{children}&rdquo;
        </blockquote>
      ),
    },
    marks: {
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="text-[#B5EB92]">{children}</span>
      ),
    },
  }
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [stickyStates, setStickyStates] = useState<boolean[]>([]) // Tracks if each card is sticky
  const [activeTab, setActiveTab] = useState<string>(data?.tabs[0]?.tabHeading)
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

          <SwitchableTabs
            isSticky={false}
            data={(data?.tabs || []).map((e: any) => ({
              key: e.tabHeading,
              title: e.tabHeading,
              link:e.link,
              linkText:e.linkText,
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
                                <PortableText
                                  value={activeTabData.description}
                                />
                              )}
                            </div>
                          </div>
                          { activeTabData?.Link && <Button type="underline" link={activeTabData?.Link}>{activeTabData?.LinkText}</Button>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Panel - Testimonial */}
                  <div className="max-w-[956px] w-full flex-1">
                    <TestimonialRightCard data={activeTabData} />
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
            openForm={() => router.push('/demo')}
            hasDemoBanner={true}
          />
        )}
      </Container>
    </Section>
  )
}
