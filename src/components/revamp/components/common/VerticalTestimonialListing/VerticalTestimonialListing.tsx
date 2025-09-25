import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Slider from 'react-slick'

import Button from '~/components/common/Button'
import { FormModal } from '~/components/common/FormModal'
import { VideoItem, VideoModal } from '~/components/common/VideoModal'
import SectionHeader from '../sectionHeader'
import { BookDemoContext } from '~/providers/BookDemoProvider'

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
          d="M9 18l6-6-6-6"
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
        }
      },
      {
        breakpoint: 1278,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 998,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 0,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  }

  return (
    <div className="py-sm md:py-md md:pb-16 bg-[#F9F9F9]">
      <div className="flex flex-col items-center w-full gap-16 max-w-[1728px] mx-auto">
        <SectionHeader
          heading={data?.heading}
          description={data?.description}
        />
        
        {/* Desktop Slider */}
        {/* <div className="md:block hidden">
          {data?.testimonial?.length > 0 && (
            <div className="w-full">
              <Slider {...settings}>
                {data?.testimonial?.map((logo: any, i: number) => (
                  <div key={i} className="px-2">
                    <div
                      className="group flex min-w-[318px] rounded-2xl min-h-[563px] justify-center overflow-hidden cursor-pointer"
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
                        <div className="absolute bottom-0 h-40 w-full pointer-events-none z-0">
                          <div className="absolute backdrop-blur-[0.5px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0),#000_10%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[2px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_10%,#000_20%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[4.5px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_20%,#000_30%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[8px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_30%,#000_40%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[12px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_40%,#000_50%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[18px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_50%,#000_60%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[24px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_60%,#000_70%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[31px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_70%,#000_80%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[40px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_80%,#000_90%)] left-0 top-0 z-[1] w-full h-full" />
                          <div className="absolute backdrop-blur-[49px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_90%,#000_100%)] left-0 top-0 z-[1] w-full h-full" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold mb-2">{logo?.name}</h3>
                              <p className="text-sm opacity-90">{logo?.designation}</p>
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
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div> */}

        {/* Mobile Slider */}
        {data?.testimonial?.length > 0 && (
          <div className="w-full pb-28 relative">
            <Slider {...settings}>
              {data?.testimonial?.map((logo: any, i: number) => (
                <div
                  key={i}
                  className="group px-2"
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
                        <div className="absolute backdrop-blur-[0.5px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0),#000_10%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[2px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_10%,#000_20%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[4.5px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_20%,#000_30%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[8px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_30%,#000_40%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[12px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_40%,#000_50%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[18px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_50%,#000_60%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[24px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_60%,#000_70%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[31px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_70%,#000_80%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[40px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_80%,#000_90%)] left-0 top-0 z-[1] w-full h-full" />
                        <div className="absolute backdrop-blur-[49px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0)_90%,#000_100%)] left-0 top-0 z-[1] w-full h-full" />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold mb-2">{logo?.name}</h3>
                            <p className="text-sm opacity-90">{logo?.designation}</p>
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