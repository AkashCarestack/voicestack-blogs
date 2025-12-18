import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick'

import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import { VideoItem, VideoModal } from '~/components/common/VideoModal'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import SectionHeader from '../sectionHeader'
import SectionHeaderV2 from '../sectionHeaderV2'

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
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
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
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

// TestimonialSlider Component
interface TestimonialSliderProps {
  data: any
  settings: any
  refer: string
}

const TestimonialSlider = ({ data, settings, refer }: TestimonialSliderProps) => {
  // Video state management
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [playVideo, setPlayVideo] = useState<boolean | null>(false)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [playingYoutubeIndex, setPlayingYoutubeIndex] = useState<number | null>(
    null,
  )
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([])

  // Handle outside click to close YouTube videos
  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent | MouseEvent) => {
      const target = event.target as HTMLElement

      const clickedInside = iframeRefs.current.some((iframe) =>
        iframe?.contains?.(target),
      )

      const insideCard = target.closest('.embla__slide')

      if (!insideCard && !clickedInside && playingYoutubeIndex !== null) {
        const iframe = iframeRefs.current[playingYoutubeIndex]
        if (iframe) {
          iframe.contentWindow?.postMessage(
            JSON.stringify({
              event: 'command',
              func: 'pauseVideo',
              args: [],
            }),
            '*',
          )
        }

        setActiveVideoIndex(null)
        setPlayingYoutubeIndex(null)
        setPlayVideo(false)
        setPlayingIndex(null)
      }
    }

    document.addEventListener('touchstart', handleTouchOutside, true)
    document.addEventListener('mousedown', handleTouchOutside, true)

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside, true)
      document.removeEventListener('mousedown', handleTouchOutside, true)
    }
  }, [playingYoutubeIndex])

  // Video handling functions
  const handleVideoPlay = (index: number) => {
    const video = videoRefs.current[index]
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }

  const handleVideoPause = (index: number) => {
    const video = videoRefs.current[index]
    if (video) {
      video.pause()
      video.currentTime = 0
    }
  }

  const handleVideoClick = (index: number, videoId: string) => {
    if (videoId) {
      // For YouTube videos - stop any playing thumbnail video first
      const video = videoRefs.current[index]
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      setPlayingIndex(index)
      setPlayingYoutubeIndex(index)
      setPlayVideo(true)
    } else {
      // For regular video files
      setPlayingIndex(index)
      const video = videoRefs.current[index]
      if (video) {
        video.currentTime = 0
        video.play()
      }
    }
  }

  if (!data?.testimonial?.length) return null

  return (
    <div className="w-full relative h-[563px]">
      <Slider {...settings}>
        {data?.testimonial?.map((logo: any, i: number) => {
          const hasVideo = !!logo?.video?.[0]?.videoId
          const image = logo?.imageThumbnail
          const isYoutubePlaying = playingYoutubeIndex === i

          return (
            <div key={i} className={`group  ${refer === 'en-AU' ? 'h-[550px]' : 'h-[560px] sm:px-1.5'}`}>
              <div
                className={`${refer === 'en-AU' ? 'h-[550px]' : 'h-[560px] rounded-2xl shadow-md'} flex flex-col justify-center cursor-pointer w-full aspect-[9/16] overflow-hidden relative`}
                onMouseEnter={() => {
                  if (playingYoutubeIndex !== i) {
                    setActiveVideoIndex(i)
                    handleVideoPlay(i)
                  }
                }}
                onMouseLeave={() => {
                  if (playingYoutubeIndex !== i) {
                    handleVideoPause(i)
                    setActiveVideoIndex(null)
                    setPlayingIndex(null)
                  }
                }}
                onClick={() => {
                  const videoId = logo?.video?.[0]?.videoId
                  handleVideoClick(i, videoId)
                }}
              >
                {isYoutubePlaying && hasVideo ? (
                  <div className={`absolute inset-0 w-full h-full overflow-hidden ${refer === 'en-AU' ? '' : 'rounded-2xl'}`}>
                    <iframe
                      ref={(el) => {
                        if (el) iframeRefs.current[i] = el
                      }}
                      src={`https://www.youtube-nocookie.com/embed/${logo?.video?.[0]?.videoId}?playlist=${logo?.video?.[0]?.videoId}&loop=1&autoplay=1&modestbranding=1&rel=0&disablekb=1&fs=0&controls=0&enablejsapi=1`}
                      className="w-full h-full animate-fadeIn transition-opacity duration-300"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        // borderRadius: '12px',
                      }}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title="YouTube video"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Thumbnail Image */}
                    {image ? (
                      <Image
                        src={image?.url}
                        className={`absolute w-full h-full object-cover z-0 transition-opacity duration-300 ${
                          activeVideoIndex === i ? 'opacity-0' : 'opacity-100'
                        }`}
                        width={400}
                        height={400}
                        alt={image?.alt || 'Testimonial Thumbnail'}
                      />
                    ) : (
                      <Image
                        src={`https://i.ytimg.com/vi/${logo?.video?.[0]?.videoId}/maxresdefault.jpg`}
                        width={400}
                        height={400}
                        className="absolute w-full h-full object-cover z-0"
                        alt="Company Logo"
                      />
                    )}

                    {/* Thumbnail Video - plays on hover */}
                    {hasVideo && (
                      <video
                        ref={(el) => (videoRefs.current[i] = el)}
                        style={{
                          backgroundColor: 'transparent',
                          objectFit: 'cover',
                        }}
                        className={`absolute h-full w-full object-cover transition-opacity duration-300 ${
                          activeVideoIndex === i ? 'opacity-100' : 'opacity-0'
                        }`}
                        loop
                        muted
                        playsInline
                      >
                        <source src={logo?.thumbnail} type="video/mp4" />
                      </video>
                    )}

                    {/* Blur Overlay */}
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
                          <div
                            className=""
                            style={{
                              height: `48px`,
                              width: `${
                                48 *
                                logo?.secondaryLogo?.metadata?.dimensions
                                  ?.aspectRatio
                              }px`,
                            }}
                          >
                            <ImageLoader
                              image={logo?.secondaryLogo?.url}
                              className="w-full h-full object-cover"
                              alt="Company Logo"
                              imageClassName=" filter brightness-[132%] "
                            />
                          </div>

                          <h3 className="text-base xl:text-lg !leading-[140%] !font-medium line-clamp-4">
                            &ldquo;
                            {logo?.keyStatement
                              ?.slice(0, 3)
                              ?.map((item: any) => item.children[0].text)
                              .join(' ')}
                            &rdquo;
                          </h3>
                          <div className="h-[1px] w-full bg-white/20 "></div>
                          <span>
                            <p className="text-sm xl:text-base font-medium">
                              {logo?.name}
                            </p>
                            <p className="text-sm text-white/60">
                              {logo?.practiceName}
                            </p>
                          </span>
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
                )}
              </div>
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

const VerticalTestimonialListing = ({
  data,
  refer = null,
  showBookFeeBtn = true,
  hideTitle = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isUk, setIsUk] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(5) // Default to 5 slides
  const [showArrows, setShowArrows] = useState(true)
  const router = useRouter()

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])

  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)

  // Handle responsive slides count
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1750) {
        // xl screens
        {
          refer === 'en-AU' ? setSlidesToShow(4) : setSlidesToShow(5)
        }
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
  const settings2 = {
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
    <>
      {refer === 'en-AU' ? (
        <Section className="bg-[#ffffff]" border="t">
          <Container
            className="w-full pt-sm md:pt-md lg:pt-lg"
            type="V2"
            border="b-0"
          >
            <div className="flex flex-col items-center w-full gap-16">
              <SectionHeaderV2
                heading={data?.heading || data?.title}
                description={data?.description}
              />
              <div
                className="lg:px-12 px-6 lg:pb-12 pb-6"
                style={{
                  backgroundImage: `url('/assets/Bg/pattern.png')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  width: '100%',
                  height: '100%',
                }}
              >
                <TestimonialSlider data={data} settings={settings2} refer={refer} />
              </div>
            </div>
          </Container>
        </Section>
      ) : (
        <div className="py-12 px-4 md:px-12 md:pt-[130px] md:pb-24 ">
          <div className="flex flex-col items-center w-full gap-16 max-w-[1628px] mx-auto">
            {!hideTitle && (
              <SectionHeader
                showFullLength={true}
                heading={data?.heading || data?.title}
                description={data?.description}
              />
            )}

            {/*  Slider */}
            <TestimonialSlider data={data} settings={settings} refer={refer} />

            {/* Book Demo Button */}
            {showBookFeeBtn && (
              <div className="flex gap-4 items-center justify-center">
                <Button type="primary" link="/demo">
                  <span className="text-base font-medium">{`Book Free Demo`}</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Modals */}
      {/* {isOpen && (
              <VideoModal
                refer={refer}
                isPopup={true}
                videoDetails={selectedVideo}
                className={`pt-9 z-30 flex items-start`}
                onClose={() => setIsOpen(false)}
                hasDemoBanner={true}
                openForm={() => router.push('/demo')}
              />
            )} */}
    </>
  )
}

export default VerticalTestimonialListing
