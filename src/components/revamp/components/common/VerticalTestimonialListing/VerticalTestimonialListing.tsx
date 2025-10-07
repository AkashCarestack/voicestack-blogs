import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Slider from 'react-slick'

import Button from '~/components/common/Button'
import { FormModal } from '~/components/common/FormModal'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { VideoItem, VideoModal } from '~/components/common/VideoModal'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import SectionHeader from '../sectionHeader'

// PrevArrow.tsx
const PrevArrow = ({ onClick, currentSlide }: any) => {
  const isDisabled = currentSlide === 0

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center absolute top-1/2 -translate-y-1/2 left-4 z-10
        ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-300 transition-colors'}`}
      aria-label="Previous"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="rotate-180"
      >
        <path
          d="M5 12H19"
          stroke="#030712"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="#030712"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
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
      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center absolute top-1/2 -translate-y-1/2 right-4 z-10
        ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-300 transition-colors'}`}
      aria-label="Next"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M5 12H19"
          stroke="#030712"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="#030712"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  )
}

const VerticalTestimonialListing = ({ data, refer = null }) => {
  // console.log(data, 'data')
  const [openForm, setOpenForm] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isUk, setIsUk] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(5) // Default to 5 slides
  const [showArrows, setShowArrows] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])
  const { isDemoPopUpShown } = useContext(BookDemoContext)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)

  // Handle responsive slides count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1750) {
        // xl screens
        setSlidesToShow(5)
      } else if (window.innerWidth >= 1278) {
        // lg screens
        setSlidesToShow(4)
      } else if (window.innerWidth >= 998) {
        // md screens
        setSlidesToShow(3)
      } else if (window.innerWidth >= 600) {
        // sm screens
        setSlidesToShow(2)
      } else {
        // xs screens
        setSlidesToShow(1)
      }
    }

    // Set initial value
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Check if we need to show arrows based on slide count
  useEffect(() => {
    if (data?.testimonial?.length <= slidesToShow) {
      setShowArrows(false)
    } else {
      setShowArrows(true)
    }
  }, [data?.testimonial?.length, slidesToShow])

  if (!data?.testimonial?.length) {
    return null
  }

  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsOpen(true)
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    arrows: showArrows,
    afterChange: (index: number) => setCurrentSlide(index),
    prevArrow: <PrevArrow currentSlide={currentSlide} />,
    nextArrow: (
      <NextArrow
        currentSlide={currentSlide}
        slideCount={data?.testimonial?.length || 0}
      />
    ),
    responsive: [
      {
        breakpoint: 1750,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1440,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1278,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 998,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="py-12 px-4 md:px-12 md:pt-[130px] md:pb-24 bg-[#F9F9F9]">
      <div className="flex flex-col items-center w-full gap-16 max-w-[1728px] mx-auto">
        <SectionHeader
          heading={data?.heading}
          description={data?.description}
        />

        {/*  Slider */}
        {data?.testimonial?.length > 0 && (
          <div className="w-full relative h-[563px]">
            <Slider {...settings}>
              {data?.testimonial?.map((logo: any, i: number) => (
                <div key={i} className="group sm:px-2 h-[563px]">
                  <div
                    className="flex flex-col justify-center rounded-2xl h-[563px] overflow-hidden shadow-md cursor-pointer w-full"
                    onClick={() => handleOpenVideo(logo?.secondaryVideo[0])}
                  >
                    <div className="relative w-full h-full">
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
                      <div className="absolute bottom-0 h-64 w-full pointer-events-none z-0 group-hover:opacity-0">
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
                      <div className="absolute bottom-0 h-64 mix-blend-darken w-full z-0 "></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_100%)]">
                        <div className="w-full">
                          {/* Content that shows by default and hides on hover */}
                          <div className="flex flex-col gap-3 group-hover:opacity-0 group-hover:pointer-events-none transition-opacity duration-300">
                            <ImageLoader
                              image={logo?.logo?.url}
                              className="w-full max-w-[200px] !h-[48px]"
                              imageClassName="object-contain filter brightness-[132%] contrast-[202%]"
                              alt="Company Logo"
                            />

                            <h3 className="text-base xl:text-lg font-medium">
                              &ldquo;{logo?.testimonialdescription}&rdquo;
                            </h3>
                            <div className="h-[1px] w-full bg-white/20 "></div>
                            <p className="text-sm xl:text-base font-medium">
                              {logo?.name}
                            </p>
                            <p className="text-sm text-white/60">
                              {logo?.designation}
                            </p>
                          </div>

                          {/* Play button that shows on hover */}
                          <div className="absolute inset-0 flex items-end justify-center pb-6 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            <Button
                              type="video"
                              className="rounded-full flex items-center w-fit 
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
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        )}

        {/* Book Demo Button */}
        <div className="flex gap-4 items-center justify-center">
          <Button
            type="primary"
            onClick={() => {
              setOpenForm(true)
            }}
          >
            <span className="text-base font-medium">{`Book free demo`}</span>
          </Button>
        </div>

        {/* Modals */}
        {openForm && (
          <FormModal
            className={`pt-9 flex items-start`}
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
      </div>
    </div>
  )
}

export default VerticalTestimonialListing
