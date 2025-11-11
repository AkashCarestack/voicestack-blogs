import { PortableText } from '@portabletext/react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'

import ImageLoader from '~/components/common/imageLoader/imageLoader'
import VideoPlayers from '~/components/common/VideoPlayer'
import SuperChargeIcon from '~/components/icons/superCharge'

import Button from '../../../../common/Button'
import { VideoItem } from '../../../../common/VideoModal'
import Container from '../../../../structure/Container'

const HeroSection = ({
  data,
  refer = null,
  page = '',
  isCentered = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const videoId =
    router.locale == 'en' ? '3CsThXKvcvRrR3hwRsWWJY' : 'Hj4GYLXARVjqQEnaejq3Bz'

  const overviewVideo: VideoItem = {
    videoPlatform: 'vidyard',
    videoId: videoId,
  }

  const [activeIndex, setActiveIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const searchParams = useSearchParams()
  const source2 = searchParams.get('source')

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <span className="text-3xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope text-gray-950">
          {children}
        </span>
      ),
    },
    marks: {
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="text-vs-purple">{children}</span>
      ),
    },
  }
  const descriptionComponents: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-lg text-gray-950 leading-[28px] line-clamp-2 self-stretch font-normal ">
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <ul className="text-base text-gray-950 leading-[24px] self-stretch pt-3 list-inside font-normal">
          {children}
        </ul>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <li
          className="flex gap-3 py-[14px] text-base text-gray-950 leading-[24px] border-b"
          style={{ borderColor: '#0307121A' }}
        >
          <span className="mt-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M11.3633 0.322475C11.4261 0.370177 11.4789 0.429802 11.5187 0.497937C11.5584 0.566072 11.5844 0.641379 11.595 0.71955C11.6056 0.797721 11.6007 0.87722 11.5806 0.953497C11.5605 1.02977 11.5255 1.10133 11.4777 1.16408L5.07767 9.56407C5.02576 9.63212 4.95989 9.68827 4.88449 9.72875C4.80908 9.76924 4.72589 9.79312 4.6405 9.79881C4.5551 9.80449 4.46948 9.79184 4.38937 9.7617C4.30927 9.73156 4.23654 9.68464 4.17607 9.62407L0.576072 6.02408C0.470089 5.91034 0.41239 5.7599 0.415133 5.60446C0.417875 5.44902 0.480845 5.30071 0.590775 5.19078C0.700705 5.08085 0.849014 5.01788 1.00445 5.01513C1.1599 5.01239 1.31033 5.07009 1.42407 5.17608L4.53927 8.29047L10.5233 0.436876C10.6196 0.310437 10.7621 0.227378 10.9196 0.20593C11.0771 0.184482 11.2367 0.226397 11.3633 0.322475Z"
                fill="#030712"
              />
            </svg>
          </span>
          <span>{children}</span>
        </li>
      ),
    },
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
    document.body.appendChild(script)
  }, [])

  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [playingYoutubeIndex, setPlayingYoutubeIndex] = useState<number | null>(
    null,
  )
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null)
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [playVideo, setPlayVideo] = useState<boolean | null>(false)

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
    setPlayingIndex(index)
    const video = videoRefs.current[index]
    if (video) {
      video.currentTime = 0
      video.play().catch((err) => console.error('Video play failed:', err))
    } else {
      console.log('No video element found for index:', index)
    }
  }

  const handleVideoPause = (index: number) => {
    if (playingIndex !== index) {
      const video = videoRefs.current[index]
      if (video) {
        video.pause()
        video.currentTime = 0
      }
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

  return (
    <section className="font-geist justify-center">
      <Container className={isCentered ? ' justify-center' : 'py-12'}>
        {isCentered ? (
          <div className="flex flex-col items-center text-center max-w-[606px] gap-3  lg:pt-20">
            <h1 className="text-base font-medium text-gray-950 ">
              {data?.heroStrip}
            </h1>
            <h2 className="text-3xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
              <PortableText value={data?.heroheading} components={components} />
            </h2>
            <PortableText
              value={data?.heroDescription}
              components={descriptionComponents}
            />
            {data?.bookBtnContent && (
              <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center lg:justify-start items-center lg:items-start >">
                {data?.bookBtnContent[0]?.buttonText && (
                  <Button
                    type="primary"
                    className="w-fit"
                    link="/demo"
                  >
                    <span>
                      {data?.bookBtnContent[0]?.buttonText || 'Book Free Demo'}
                    </span>
                  </Button>
                )}
                {data?.bookBtnContent[1]?.buttonText && (
                  <Button type="secondary" className="w-fit" link={'/pricing'}>
                    {data?.bookBtnContent[1]?.buttonText || 'See Pricing'}
                  </Button>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between lg:gap-24 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-3 flex-1 max-w-[607px] w-full justify-center lg:justify-start">
              {/* Feature Tag */}
              {page === 'home' ? (
                <div className="flex w-fit mx-auto lg:mx-0 text-center md:text-left items-center space-x-2 rounded-full border border-[rgba(174,160,255,0.20)] bg-[rgba(174,160,255,0.20)] py-[9px] pl-4 pr-[14px]">
                  <SuperChargeIcon />
                  <h1 className="text-sm font-medium text-gray-950 ">
                    {data?.heroStrip}
                  </h1>
                </div>
              ) : (
                <div className="text-center lg:text-left">
                  <h1 className="text-base font-medium text-gray-950">
                    {data?.heroStrip}
                  </h1>
                </div>
              )}

              {/* Main Headline */}
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-3xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
                  <PortableText
                    value={data?.heroheading}
                    components={components}
                  />
                </h2>
              </div>

              {/* Description */}
              <PortableText
                value={data?.heroDescription}
                components={descriptionComponents}
              />

              {data?.bookBtnContent && (
                <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center lg:justify-start items-center lg:items-start >">
                  <Button
                    type="primary"
                    className="w-fit"
                    link="/demo"
                  >
                    <span>
                      {data?.bookBtnContent[0]?.buttonText || 'Book Free Demo'}
                    </span>
                  </Button>
                  <Button type="secondary" className="w-fit" link={'/pricing'}>
                    {data?.bookBtnContent[1]?.buttonText || 'See Pricing'}
                  </Button>
                </div>
              )}
            </div>

            {/* Right Content - Video Section */}
            <div className="relative w-full max-w-[537px] md:py-9">
              <div className="relative w-full h-[550px] rounded-[12px] md:rounded-[24px] overflow-hidden md:aspect-video">
                {data?.video   ? (
                  <VideoPlayers
                    video={data?.video[0]}
                    thumbnail={data?.video[0]?.videoThumbnail}
                  />
                ) : data?.testimonial ? (
                  <div className="md:max-w-[606px] leading-none flex-1 flex justify-center lg:justify-end items-start relative">
                    <div className="absolute right-auto left-1/2 md:left-auto md:right-0 top-[0] bg-[#4A3CE1] opacity-10 rounded-[12px] md:rounded-[22px] -translate-x-1/2 lg:translate-x-0 rotate-[-7.7deg] scale-90 aspect-[9/16] lg:aspect-[380/550] w-[300px] lg:w-[380px] shrink-0 origin-bottom-left"></div>
                    <div className="relative rounded-[8px] md:rounded-[16px] aspect-[9/16] lg:aspect-[380/550] w-[300px] lg:w-[380px] overflow-hidden shrink-0">
                      <div
                        className="group flex flex-col justify-center rounded-2xl h-[550px] shadow-md cursor-pointer w-full aspect-[9/16] overflow-hidden relative"
                        onMouseEnter={() => {
                          // Only play thumbnail video if YouTube is not playing
                          if (playingYoutubeIndex !== 0) {
                            setActiveVideoIndex(0)
                            handleVideoPlay(0)
                          }
                        }}
                        onMouseLeave={() => {
                          // Only pause thumbnail video if YouTube is not playing
                          if (playingYoutubeIndex !== 0) {
                            handleVideoPause(0)
                            setActiveVideoIndex(null)
                            setPlayingIndex(null)
                          }
                        }}
                        onClick={() => {
                          const videoId = data?.testimonial?.video?.[0]?.videoId
                          handleVideoClick(0, videoId)
                        }}
                      >
                        {playingYoutubeIndex === 0 &&
                        data?.testimonial?.video?.[0]?.videoId ? (
                          <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
                            <iframe
                              ref={(el) => {
                                if (el) iframeRefs.current[0] = el
                              }}
                              src={`https://www.youtube-nocookie.com/embed/${data?.testimonial?.video?.[0]?.videoId}?playlist=${data?.testimonial?.video?.[0]?.videoId}&loop=1&autoplay=1&modestbranding=1&rel=0&disablekb=1&fs=0&controls=0&enablejsapi=1`}
                              className="w-full h-full animate-fadeIn transition-opacity duration-300"
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                border: 'none',
                                borderRadius: '12px',
                              }}
                              allow="autoplay; encrypted-media"
                              allowFullScreen
                              title="YouTube video"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full h-full rounded-2xl overflow-hidden">
                            {/* Thumbnail Video - plays on hover */}
                            {data?.testimonial?.thumbnail && (
                              <video
                                ref={(el) => (videoRefs.current[0] = el)}
                                key={data?.testimonial?.thumbnail}
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
                                <source
                                  src={data?.testimonial?.thumbnail}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
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
                            {/* Play button that shows on hover - Top right of card */}
                            <div className="absolute top-4 right-4 z-30 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                              <div
                                className="rounded-full flex items-center cursor-pointer justify-center w-24 h-10 border border-white/20 bg-black/15 text-white hover:bg-black/25 transition-colors duration-200"
                                onClick={() =>
                                  handleVideoClick(
                                    0,
                                    data?.testimonial?.video?.[0]?.videoId,
                                  )
                                }
                              >
                                <span className="flex items-center">
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
                                      fill="currentColor"
                                    />
                                  </svg>
                                  Play
                                </span>
                              </div>
                            </div>

                            {/* Content that shows by default and hides on hover */}
                            <div className="absolute bottom-0 w-full h-2/3 z-10 flex flex-col justify-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_100%)]">
                              <div className="flex flex-col justify-end w-full pb-6 text-white">
                                {playingIndex !== 0 && (
                                  <div className="px-6">
                                    <div
                                      className="mb-4"
                                      style={{
                                        height: `48px`,
                                        width: `${
                                          48 *
                                            data?.testimonial?.logo?.metadata
                                              ?.dimensions?.aspectRatio || 2
                                        }px`,
                                      }}
                                    >
                                      <ImageLoader
                                        image={data?.testimonial?.logo?.url}
                                        alt={data?.testimonial?.logo?.alt || 'Company Logo'}
                                        title={data?.testimonial?.logo?.title || 'Company Logo'}
                                        className="w-full h-full object-contain filter brightness-[132%] contrast-[202%]"
                                      />
                                    </div>

                                    <h3 className="text-base xl:text-lg font-medium">
                                      &ldquo;
                                      {
                                        data?.testimonial
                                          ?.testimonialdescription
                                      }
                                      &rdquo;
                                    </h3>
                                    <div className="h-[1px] w-full bg-white/20 my-3"></div>
                                    <p className="text-sm xl:text-base font-medium">
                                      {data?.testimonial?.name}
                                    </p>
                                    <p className="text-sm text-white/60">
                                      {data?.testimonial?.designation}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Hero Image Fallback when no video or testimonial
                  <ImageLoader
                    image={data?.heroImage?.url}
                    alt={data?.heroImage?.altText}
                    title={data?.heroImage?.title}
                    className="w-full h-full object-cover rounded-[12px] md:rounded-[24px]"
                  />
                )}
              </div>
            </div>
          </div>
        )}

      </Container>
    </section>
  )
}

export default HeroSection
