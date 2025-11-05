import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import Button from '../common/Button'
import TestimonialCard from '../common/TestimonialCard'
import { VideoItem, VideoModal } from '../common/VideoModal'
import ButtonArrow from '../icons/ButtonArrow'
import Container from '../structure/Container'
import Section from '../structure/Section'
import H2 from '../typography/H2'
import Paragraph from '../typography/Paragraph'

export default function Testimonials({ data, refer = null }) {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const [stickyStates, setStickyStates] = useState<boolean[]>([]) // Tracks if each card is sticky
  const router = useRouter()

  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsOpen(true)
  }

  useEffect(() => {
    const handleScroll = () => {
      const updatedStickyStates = data.map((_, index) => {
        const card = cardRefs.current[index]
        if (card) {
          const rect = card.getBoundingClientRect()
          // Check if the card is at the top of the viewport (sticky point)
          return rect.top <= 200
        }
        return false
      })
      setStickyStates(updatedStickyStates)
    }

    window.addEventListener('scroll', handleScroll)

    // Cleanup listener on unmount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [data])

  if (isEmpty(data)) {
    return (
      <>
        <p>Testimonial Section is Loading...</p>
      </>
    )
  }

  return (
    <Section className="relative py-sm md:py-md pb-8 bg-gray-900">
      <Container className="w-full relative">
        <div className="flex flex-col items-center w-full gap-16">
          <div className="flex justify-center w-full">
            <div className="flex flex-col w-full max-w-[780px] text-center gap-4">
              <H2 className="text-white">Purpose-built for Practice Growth</H2>
              {refer == 'carestack' ? (
                <Paragraph className="text-gray-400">
                  VoiceStack is trusted by the most successful dental groups in
                  CareStack to create impactful business outcomes across all
                  their locations.
                </Paragraph>
              ) : (
                <Paragraph className="text-gray-400">
                  VoiceStack is trusted by some of the most successful dental
                  groups to create impactful business outcomes across all their
                  locations.
                </Paragraph>
              )}
            </div>
          </div>

          <div className="flex w-full gap-12 z-10 relative">
            <div className="w-full relative">
              <div className="flex flex-col w-full gap-8 md:gap-20">
                {data &&
                  data?.map((testimonial, index) => {
                    // Calculate the scaling value dynamically when sticky
                    const isSticky = stickyStates[index] || false
                    const scale = 0.95 + index * 0.02
                    return (
                      <TestimonialCard
                        key={index}
                        index={index}
                        data={testimonial}
                        ref={(el) => (cardRefs.current[index] = el)}
                        onOpenVideo={handleOpenVideo}
                        isSticky={isSticky}
                        scale={scale}
                      />
                    )
                  })}
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            {refer == 'carestack' ? (
              <Button
                type="primary"
                link={`/demo?region=${router.locale}`}
                locale={false}
                target="_blank"
              >
                <span className="rounded-[8px] border border-white/10 bg-[#B5EB92] px-6 py-2.5 text-black font-medium">
                  Book Free Demo
                </span>
              </Button>
            ) : (
              <Button type="primary">
                <span className="rounded-[8px] border border-white/10 bg-[#B5EB92] px-6 py-2.5 text-black font-medium">
                  Book Free Demo
                </span>
              </Button>
            )}
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
