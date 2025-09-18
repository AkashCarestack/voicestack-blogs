import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Slider from 'react-slick'

import getTextByReferrer from '~/helpers/getTextByReferrer'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import Button from './common/Button'
import { FormModal } from './common/FormModal'
import ImageLoader from './common/imageLoader/imageLoader'
import { VideoItem, VideoModal } from './common/VideoModal'
import ButtonArrow from './icons/ButtonArrow'
import Container from './structure/Container'
import Section from './structure/Section'
import H2 from './typography/H2'
import Paragraph from './typography/Paragraph'
import VideoPlayer from './common/VideoPlayer'

// PrevArrow.tsx
const PrevArrow = ({ onClick, currentSlide }: any) => {
  const isDisabled = currentSlide === 0

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center absolute -bottom-12 left-[55%] -translate-x-16 z-10
        ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
      aria-label="Previous"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M15 18l-6-6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

// NextArrow.tsx
const NextArrow = ({ onClick, currentSlide, slideCount }: any) => {
  const isDisabled = currentSlide >= slideCount - 1.85

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center absolute -bottom-12 left-[35%] translate-x-16
        ${isDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white'}`}
      aria-label="Next"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M9 6l6 6-6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  )
}

const LogoListingSection = ({ data, refer = null }) => {
  const [openForm, setOpenForm] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [isUk, setIsUk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])
  const { isDemoPopUpShown } = useContext(BookDemoContext)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsOpen(true)
  }


  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1.15,
    slidesToScroll: 1,
    arrows: true,
    afterChange: (index: number) => setCurrentSlide(index),
    prevArrow: <PrevArrow currentSlide={currentSlide} />,
    nextArrow: (
      <NextArrow
        currentSlide={currentSlide}
        slideCount={Math.ceil(data?.testimonial?.length - 1.15 + 1)}
      />
    ),
  }

  return (
    <Section className="py-sm md:py-md md:pb-16">
      <Container>
        <div className="flex flex-col items-center w-full">
          <div
            className={`flex justify-center w-full ${data?.image?.length > 0 && `mb-12`}`}
          >
            <div className="flex flex-col w-full max-w-[780px] text-center gap-4">
              <H2>
                {data?.logoSectionHeader}
              </H2>
              <Paragraph
                dangerouslySetInnerHTML={{
                  __html: data?.logoSectionHeaderDescptn
                }}
              ></Paragraph>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 max-w-[1034px]">
            {data?.image &&
              data.image?.length &&
              data?.image?.map((logo: any, i) => {
                return (
                  <Image
                    src={logo.url}
                    alt={logo.altText || 'organization Logo'}
                    title={logo.altText}
                    width={logo?.metadata?.dimensions?.width}
                    height={logo?.metadata?.dimensions?.height}
                    className={`${isUk ? 'h-[52px]' : 'h-10'} w-auto`}
                    key={logo?._id}
                  ></Image>
                )
              })}
          </div>
          <div className="flex gap-4 items-center mt-12 lg:mt-16">
            {refer == 'carestack' ? (
              <Button
                type="primary"
                link={`/demo?region=${router.locale}`}
                locale={false}
                target="_blank"
              >
                <ButtonArrow></ButtonArrow>
                <span className="text-base font-medium">
                  {`Book free demo`}
                </span>
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  setOpenForm(true)
                }}
              >
                <ButtonArrow></ButtonArrow>
                <span className="text-base font-medium">{`Book free demo`}</span>
              </Button>
            )}
          </div>
        </div>
        {openForm && (
          <FormModal
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
            data={isDemoPopUpShown}
          />
        )}
      </Container>
      {isOpen && (
        <VideoModal
          refer={refer}
          isPopup={true}
          videoDetails={selectedVideo}
          className={`pt-9 z-30 flex items-start`}
          onClose={() => setIsOpen(false)}
          hasDemoBanner={true}
          openForm={() => setOpenForm(true)}
        />
      )}
    </Section>
  )
}

export default LogoListingSection
