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
import VideoPlayer from './common/VideoPlayer'
import ButtonArrow from './icons/ButtonArrow'
import Container from './structure/Container'
import Section from './structure/Section'
import H2 from './typography/H2'
import Paragraph from './typography/Paragraph'

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

const VerticalTestimonialListing = ({ data, refer = null }) => {
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

  if (!data?.testimonial?.length) {
    return null;
  }
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
    <Section className="py-sm md:py-md md:pb-16 bg-[#F9F9F9]">
=        <div className="flex flex-col items-center w-full gap-16 max-w-[1728px] mx-auto">
          <div
            className={`flex justify-center w-full`}
          >
            <div className="flex flex-col w-full max-w-[780px] text-center gap-4">
              <H2>
                {data?.heading}
              </H2>
              <Paragraph
                dangerouslySetInnerHTML={{
                    __html: data?.description,
                }}
              ></Paragraph>
            </div>
          </div>
          <div className="md:block hidden">
            {data?.testimonial?.length > 0 && (
              <div className="xl:h-[564px] w-full justify-center flex flex-wrap gap-3">
                {data?.testimonial?.map((logo: any, i: number) => {
                  return (
                    <div
                      key={i}
                      className="group flex min-w-[318px] rounded-2xl min-h-[563px] justify-center overflow-hidden  cursor-pointer"
                      onClick={() => handleOpenVideo(logo?.secondaryVideo[0])}
                    >
                      <div className="relative w-full h-full ">
                        {/* Background image */}
                        {/* <ImageLoader
                          className="absolute h-full w-full object-cover"
                          image={logo?.thumbnail}
                        /> */}
                        <video
                          key={logo?.thumbnail}
                          style={{
                            backgroundColor: 'transparent',
                            backgroundImage: 'none',
                            backgroundSize: 0,
                            backgroundPosition: 0,
                            backgroundRepeat: 'no-repeat',
                            objectFit: 'cover',
                          }}
                          className="absolute h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src={logo?.thumbnail} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        {/* Blur blobs layer */}
                        <div className="absolute bottom-0 h-40 w-full pointer-events-none z-0">
                          <div className="absolute  backdrop-blur-[0.5px]  [mask-image:linear-gradient(180deg,rgba(0,0,0,0),#000_10%)] left-0 top-0 z-[1] w-full h-full " />
                          <div className="absolute backdrop-blur-[2px]  [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_10%,#000_20%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[4.5px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_20%,#000_30%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[8px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_30%,#000_40%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[12px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_40%,#000_50%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[18px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_50%,#000_60%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[24px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_60%,#000_70%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[31px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_70%,#000_80%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[40px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_80%,#000_90%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[49px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_90%,#000_100%)] left-0 top-0 z-[1] w-full h-full" />
                        </div>
                        <div
                          className="absolute bottom-0 w-full h-40 z-10 flex flex-col justify-end items-center 
                    bg-gradient-to-t from-black/60 via-black/30 to-transparent "
                        >
                          <div
                            className="flex flex-col justify-end items-center pb-4 gap-4 translate-y-8 group-hover:translate-y-0 
                      transition-all duration-500 ease-in-out text-white"
                          >
                            <div className="text-center">
                              <h3 className="text-base font-medium">
                                {logo?.practiceName}
                              </h3>
                              <p className="text-base font-normal">
                                {logo?.locations} {logo?.locations > 1 ? "Locations": "Location"} 
                              </p>
                            </div>
                            <Button
                              type="video"
                              className="rounded-full flex opacity-0 group-hover:opacity-100 items-center w-fit 
                     border border-white/20 bg-black/20 text-white"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="16"
                                viewBox="0 0 17 16"
                                fill="none"
                                className="mr-2"
                              >
                                <path
                                  d="M3.5 3.73c0-.27.07-.53.21-.76.13-.23.33-.42.57-.55.24-.13.5-.2.77-.19.27.01.53.09.77.23l6.7 4.27c.21.13.39.32.51.54.12.23.19.48.19.74 0 .26-.07.52-.19.74-.12.22-.3.41-.51.54l-6.7 4.27c-.23.15-.49.23-.76.24-.27.01-.53-.06-.77-.19-.24-.13-.44-.32-.57-.55-.14-.23-.21-.49-.21-.76V3.73Z"
                                  fill="white"
                                />
                              </svg>
                              <span>Play</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          {data?.testimonial?.length > 0 && (
            <div className="w-full md:hidden pb-28 relative">
            <Slider {...settings}>
              {data?.testimonial?.map((logo: any, i: number) => (
                <div
                  key={i}
                  className="group px-2" // Optional padding between slides
                >
                  <div
                    className="flex flex-col justify-center rounded-2xl h-full overflow-hidden shadow-md cursor-pointer w-full"
                    onClick={() => handleOpenVideo(logo?.secondaryVideo[0])}
                  >
                    <div className="relative w-full h-[400px]">
                      <video
                          key={logo?.thumbnail}
                          style={{
                            backgroundColor: 'transparent',
                            backgroundImage: 'none',
                            backgroundSize: 0,
                            backgroundPosition: 0,
                            backgroundRepeat: 'no-repeat',
                            objectFit: 'cover',
                          }}
                          className="absolute h-full w-full object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src={logo?.thumbnail} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      <div className="absolute bottom-0 h-40 w-full pointer-events-none z-0">
                        <div className="absolute  backdrop-blur-[0.5px]  [mask-image:linear-gradient(180deg,rgba(0,0,0,0),#000_10%)] left-0 top-0 z-[1] w-full h-full " />
                        <div className="absolute backdrop-blur-[2px]  [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_10%,#000_20%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[4.5px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_20%,#000_30%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[8px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_30%,#000_40%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[12px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_40%,#000_50%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[18px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_50%,#000_60%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[24px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_60%,#000_70%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[31px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_70%,#000_80%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[40px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_80%,#000_90%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[49px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_90%,#000_100%)] left-0 top-0 z-[1] w-full h-full" />
                      </div>
                      <div
                        className="absolute bottom-0 w-full h-40 z-10 flex flex-col justify-end items-center 
                    bg-gradient-to-t from-black/60 via-black/30 to-transparent gap-2 pb-4"
                      >
                        <div className="text-center text-white">
                          <h3 className="text-base font-medium">
                            {logo?.practiceName}
                          </h3>
                          <p className="text-sm font-normal">
                            {logo?.locations} {logo?.locations > 1 ? "Locations": "Location"} 
                          </p>
                        </div>

                        <Button
                          type="video"
                          className="rounded-full flex items-center w-fit border border-white/20 bg-black/15 backdrop-blur-xl text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="17"
                            height="16"
                            viewBox="0 0 17 16"
                            fill="none"
                            className="mr-2"
                          >
                            <path
                              d="M3.49994 3.73197C3.50006 3.46327 3.57236 3.19954 3.70928 2.96834C3.8462 2.73714 4.04271 2.54696 4.27827 2.41768C4.51382 2.2884 4.77978 2.22478 5.04835 2.23345C5.31691 2.24212 5.57821 2.32277 5.80494 2.46697L12.5109 6.73397C12.7238 6.86945 12.8991 7.05645 13.0205 7.27765C13.142 7.49886 13.2056 7.74713 13.2056 7.99947C13.2056 8.25182 13.142 8.50009 13.0205 8.72129C12.8991 8.9425 12.7238 9.1295 12.5109 9.26498L5.80494 13.533C5.57814 13.6772 5.31674 13.7579 5.0481 13.7665C4.77945 13.7751 4.51342 13.7114 4.27783 13.582C4.04224 13.4526 3.84574 13.2623 3.7089 13.031C3.57205 12.7996 3.49988 12.5358 3.49994 12.267V3.73197Z"
                              fill="white"
                            />
                          </svg>
                          <span>Play</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
            </div>
          )}

          <div className="flex gap-4 items-center">
            <Button
              type="primary"
              onClick={() => {
                setOpenForm(true)
              }}
            >
              {/* <ButtonArrow></ButtonArrow> */}
              <span className="text-base font-medium">{`Book free demo`}</span>
            </Button>
          </div>
        </div>
        {openForm && (
          <FormModal
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
            data={isDemoPopUpShown}
          />
        )}
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

export default VerticalTestimonialListing
