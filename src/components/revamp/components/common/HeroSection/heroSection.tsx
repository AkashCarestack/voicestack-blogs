import { PortableText } from '@portabletext/react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import ImageLoader from '~/components/common/imageLoader/imageLoader'
import VideoPlayers from '~/components/common/VideoPlayer'
import SuperChargeIcon from '~/components/icons/superCharge'
import { toCamelCase } from '~/utils/common'

import Button from '../../../../common/Button'
import { VideoItem } from '../../../../common/VideoModal'
import Container from '../../../../structure/Container'
import { urlForVideo } from '~/lib/sanity.image'
import { formatPhoneNumberWithCountryCode } from '~/components/utils/helper'

const HeroSection = ({
  data,
  refer = null,
  page = '',
  isCentered = false,
  showFullDescription = true,
  contactData = null,
}: {
  data?: any
  refer?: any
  page?: string
  isCentered?: boolean
  showFullDescription?: boolean
  contactData?: any
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const videoId =
    router.locale == 'en' ? '3CsThXKvcvRrR3hwRsWWJY' : 'Hj4GYLXARVjqQEnaejq3Bz'

  const overviewVideo: VideoItem = {
    videoPlatform: 'vidyard',
    videoId: videoId,
  }

  const [activeIndex, setActiveIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const movFile = data?.video?.[0]?.uploadVideos?.find(
    (e: any) => e.type === 'mov',
  )?.url
  const webpFile = data?.video?.[0]?.uploadVideos?.find(
    (e: any) => e.type === 'webm',
  )?.url
  const mp4File = data?.video?.[0]?.uploadVideos?.find(
    (e: any) => e.type === 'mp4',
  )?.url
  const [movFileUrl, setMovFile] = useState<string>(
    data?.video?.[0]?.uploadVideos?.find((e: any) => e.type === 'mov')?.url,
  )
  const [webpFileUrl, setWebpFile] = useState<string>(
    data?.video?.[0]?.uploadVideos?.find((e: any) => e.type === 'webm')?.url,
  )
  const [mp4FileUrl, setMp4File] = useState<string>(
    data?.video?.[0]?.uploadVideos?.find((e: any) => e.type === 'mp4')?.url,
  )
  useEffect(() => {
    if (movFile) {
      setMovFile(movFile)
    }
    if (webpFile) {
      setWebpFile(webpFile)
    }
    if (mp4File) {
      setMp4File(mp4File)
    }
  }, [movFile, webpFile, mp4File])

  const videoKey = useMemo(
    () => `${webpFileUrl}-${movFileUrl}-${mp4FileUrl}`,
    [webpFileUrl, movFileUrl, mp4FileUrl],
  )

  const searchParams = useSearchParams()
  const source2 = searchParams.get('source')

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <span className="">{children}</span>
      ),
    },
    marks: {
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="text-vs-purple">{children}</span>
      ),
    },
  }
  // Check if description needs "see more" functionality
  const [needsSeeMore, setNeedsSeeMore] = useState(false)

  useEffect(() => {
    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (
        descriptionRef.current &&
        !showFullDescription &&
        data?.heroDescription
      ) {
        const element = descriptionRef.current
        const paragraphs = element.querySelectorAll('p')

        if (paragraphs.length > 0) {
          // Check all paragraphs to see if any are truncated
          let hasTruncatedContent = false

          paragraphs.forEach((paragraph) => {
            // Create a clone without line-clamp to measure full height
            const clone = paragraph.cloneNode(true) as HTMLElement
            clone.style.position = 'absolute'
            clone.style.visibility = 'hidden'
            clone.style.height = 'auto'
            clone.style.maxHeight = 'none'
            clone.classList.remove('line-clamp-2')
            document.body.appendChild(clone)

            const fullHeight = clone.offsetHeight
            const clampedHeight = paragraph.offsetHeight
            const lineHeight = 28
            const maxHeight = lineHeight * 2

            // Check if content exceeds 2 lines
            if (fullHeight > maxHeight || fullHeight > clampedHeight) {
              hasTruncatedContent = true
            }

            document.body.removeChild(clone)
          })

          setNeedsSeeMore(hasTruncatedContent)
        }
      } else {
        setNeedsSeeMore(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [showFullDescription, data?.heroDescription, isDescriptionExpanded])

  const descriptionComponents: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p
          className={`${showFullDescription || isDescriptionExpanded ? '' : 'line-clamp-2 self-stretch'} text-lg text-gray-950 leading-[28px] mb-3 font-normal `}
        >
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
          className="flex lg:justify-start justify-center gap-3 py-[10px] md:py-[14px] text-base text-gray-950 leading-[24px] border-b"
          style={{ borderColor: '#0307121A' }}
        >
          <span className="mt-1 md:mt-2 lg:flex hidden">
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
    marks: {
      link: ({
        children,
        value,
      }: {
        children: React.ReactNode
        value?: any
      }) => {
        const href = value?.href || '#'
        const isExternal = href?.startsWith('http') || href?.startsWith('//')
        return (
          <a
            href={href}
            target={'_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-vs-blue font-medium   hover:text-vs-purple transition-colors duration-200"
          >
            {children}
          </a>
        )
      },
    },
  }
  const testimonialDescriptionComponents: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-base xl:text-lg font-medium">
          &ldquo;{children}&rdquo;
        </p>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="text-base xl:text-lg font-medium">
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
      // Safari compatibility: ensure video is loaded before playing
      if (video.readyState < 2) {
        video.load()
      }
      video.currentTime = 0
      const playPromise = video.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Video play failed:', err)
          // Safari might block autoplay, try again after a short delay
          setTimeout(() => {
            video.play().catch(() => {})
          }, 100)
        })
      }
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
      <Container
        className={`${isCentered ? ' ' : 'py-4 lg:py-0'} justify-center`}
      >
        {isCentered ? (
          <div
            className={`${showFullDescription ? 'max-w-[808px]' : 'max-w-[606px]'} flex flex-col items-center text-center  gap-3 py-12  lg:pt-md lg:pb-md`}
          >
            {data.heroStrip && data.heroheading ? (
              <>
                <h1 className="text-base font-medium text-gray-950 uppercase">
                  {toCamelCase(data?.heroStrip)}
                </h1>
                <h2 className="text-4xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
                  <PortableText value={data?.heroheading} components={components} />
                </h2>
              </>
            ): data.heroStrip ?(
              <h1 className="text-4xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
                {data.heroStrip}
              </h1>
            ): null}

            {data?.heroDescription && (
              <div ref={descriptionRef} className="w-full">
                <PortableText
                  value={data?.heroDescription}
                  components={descriptionComponents}
                />
              </div>
            )}
            {!showFullDescription && needsSeeMore && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-base font-medium text-vs-purple hover:text-vs-purple/80 transition-colors mt-2 self-center"
              >
                {isDescriptionExpanded ? 'See Less' : 'See More'}
              </button>
            )}

            {data?.bookBtnContent &&
              Array.isArray(data.bookBtnContent) &&
              data.bookBtnContent.length > 0 && (
                <div className="flex flex-col gap-4 pt-5 justify-center lg:justify-start items-center ">
                  
                    {/* If 2 or fewer buttons, show them in a row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {data.bookBtnContent.map((button: any, index: number) => {
                        if (!button?.buttonText) return null
                        // Default first button to 'primary' if buttonType is not set or is empty
                        const buttonType =
                          index === 0 &&
                          (!button?.buttonType || button?.buttonType === '')
                            ? 'primary'
                            : button?.buttonType || 'secondary'
                        return (
                          <Button
                            key={button?._key || index}
                            type={buttonType}
                            className="w-fit"
                            link={button?.buttonLink}
                            buttonVariant={button?.buttonVariant}
                            target={
                              data.bookBtnContent[index]?.openInNewTab
                                ? '_blank'
                                : '_self'
                            }
                          >
                            {button?.buttonIcon && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: button.buttonIcon,
                                }}
                              />
                            )}
                            <span>{button.buttonText}</span>
                          </Button>
                        )
                      })}
                    </div>
                  
                </div>
            )}

            {contactData && (
              <div className="flex flex-col md:flex-row gap-4 pt-5 justify-center lg:justify-start items-center ">
                {page == 'contact' ? (
                  <>
                    <Button type="secondaryTel" link={`tel:${formatPhoneNumberWithCountryCode(contactData.phoneNumber, router.locale)}`}>
                      <span>{contactData.phoneNumber}</span>
                    </Button>
                    <Button type="secondaryMail" link={`mailto:${contactData.salesEmail}`}>
                      <span>{contactData.salesEmail}</span>
                    </Button>
                  </>
                ): page == 'support' ? (
                  <>
                    <Button type="secondaryTel" link={`tel:${formatPhoneNumberWithCountryCode(contactData.supportPhoneNumber, router.locale)}`}>
                      <span>{contactData.supportPhoneNumber}</span>
                    </Button>
                    <Button type="secondaryMail" link={`mailto:${contactData.contactEmail}`}>
                      <span>{contactData.contactEmail}</span>
                    </Button>
                  </>
                ): null}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between lg:gap-24 gap-12 w-full items-center lg:items-start">
            {/* Left Content */}
            <div className="space-y-3 flex-1 max-w-[607px] w-full justify-center lg:justify-start flex flex-col pt-8 lg:py-sm xl:py-md">
              {/* Feature Tag */}
              {page === 'home' ? (
                <div className="flex w-fit mx-auto lg:mx-0 text-center lg:text-left items-center space-x-2 rounded-full border border-[rgba(174,160,255,0.20)] bg-[rgba(174,160,255,0.20)] py-[9px] pl-4 pr-[14px]">
                  <span className="hidden md:block">
                    <SuperChargeIcon />
                  </span>
                  <h1 className="text-sm font-medium text-gray-950 uppercase">
                    {data?.heroStrip}
                  </h1>
                </div>
              ) : (
                <div className="text-center lg:text-left">
                  <h1 className="text-base font-medium text-gray-950 uppercase">
                    {toCamelCase(data?.heroStrip)}
                  </h1>
                </div>
              )}

              {/* Main Headline */}
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
                  <PortableText
                    value={data?.heroheading}
                    components={components}
                  />
                </h2>
              </div>

              {/* Description */}
              <div
                ref={descriptionRef}
                className="w-full lg:text-left text-center"
              >
                <PortableText
                  value={data?.heroDescription}
                  components={descriptionComponents}
                />
              </div>
              {!showFullDescription && needsSeeMore && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="text-base font-medium text-vs-purple hover:text-vs-purple/80 transition-colors mt-2 lg:self-start"
                >
                  {isDescriptionExpanded ? 'See Less' : 'See More'}
                </button>
              )}

              {data?.bookBtnContent &&
                Array.isArray(data.bookBtnContent) &&
                data.bookBtnContent.length > 0 && (
                  <div className="flex flex-col !mt-0 gap-4 pt-12 justify-center lg:justify-start items-center lg:items-start">
                    {data.bookBtnContent.length > 2 ? (
                      <>
                        {/* First button on top */}
                        {data.bookBtnContent[0]?.buttonText && (
                          <Button
                            key={data.bookBtnContent[0]?._key || 0}
                            type={
                              !data.bookBtnContent[0]?.buttonType ||
                              data.bookBtnContent[0]?.buttonType === ''
                                ? 'primary'
                                : data.bookBtnContent[0]?.buttonType ||
                                  'secondary'
                            }
                            className="w-fit"
                            link={data.bookBtnContent[0]?.buttonLink}
                            buttonVariant={
                              data.bookBtnContent[0]?.buttonVariant
                            }
                          >
                            {data.bookBtnContent[0]?.buttonIcon && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: data.bookBtnContent[0].buttonIcon,
                                }}
                              />
                            )}
                            <span>{data.bookBtnContent[0].buttonText}</span>
                          </Button>
                        )}
                        {/* Remaining buttons in a row */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {data.bookBtnContent
                            .slice(1)
                            .map((button: any, index: number) => {
                              if (!button?.buttonText) return null
                              return (
                                <Button
                                  key={button?._key || index + 1}
                                  type={button?.buttonType || 'secondary'}
                                  className="w-fit"
                                  link={button?.buttonLink}
                                  buttonVariant={button?.buttonVariant}
                                >
                                  {button?.buttonIcon && (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: button.buttonIcon,
                                      }}
                                    />
                                  )}
                                  <span>{button.buttonText}</span>
                                </Button>
                              )
                            })}
                        </div>
                      </>
                    ) : (
                      /* If 2 or fewer buttons, show them in a row */
                      <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                        {data.bookBtnContent.map(
                          (button: any, index: number) => {
                            // Default first button to 'primary' if buttonType is not set or is empty
                            const buttonType =
                              index === 0 &&
                              (!button?.buttonType || button?.buttonType === '')
                                ? 'primary'
                                : button?.buttonType || 'secondary'
                            return (
                              <Button
                                key={button?._key || index}
                                type={buttonType}
                                className="w-fit"
                                link={button?.buttonLink}
                                buttonVariant={button?.buttonVariant}
                              >
                                {button?.buttonIcon && (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: button.buttonIcon,
                                    }}
                                  />
                                )}
                                <span>{button?.buttonText}</span>
                              </Button>
                            )
                          },
                        )}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Right Content - Video Section */}
            <div className="relative w-full max-w-[537px] pb-4 md:py-12 lg:py-14">
              <div className="relative w-full h-full md:h-[550px] rounded-[12px] md:rounded-[24px] overflow-hidden md:aspect-video bg-transparent">
                {data?.video ? (
                  <video
                    key={videoKey}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="auto"
                    className="w-full h-full object-cover"
                    controls={false}
                  >
                    {movFileUrl && (
                      <source
                        key={movFileUrl}
                        src={movFileUrl}
                        type='video/mp4; codecs="hvc1"'
                      />
                    )}
                    {webpFileUrl && (
                      <source
                        key={webpFileUrl}
                        src={webpFileUrl}
                        type="video/webm"
                      />
                    )}
                    {mp4FileUrl && (
                      <source
                        key={mp4FileUrl}
                        src={mp4FileUrl}
                        type="video/mp4"
                      />
                    )}
                    Your browser does not support HTML5 video.
                  </video>
                ) : data?.testimonial ? (
                  <div className="lg:max-w-[606px] leading-none flex-1 flex justify-center lg:justify-end items-start relative">
                    <div className="absolute right-auto left-1/2 lg:left-auto lg:right-0 top-[0] bg-[#4A3CE1] opacity-10 rounded-[12px] md:rounded-[22px] -translate-x-1/2 lg:translate-x-0 rotate-[-7.7deg] scale-90 aspect-[9/16] lg:aspect-[380/550] w-[300px] lg:w-[380px] shrink-0 origin-bottom-left"></div>
                    <div className="relative rounded-[8px] md:rounded-[16px] aspect-[9/16] lg:aspect-[380/550] w-[300px] lg:w-[380px] overflow-hidden shrink-0">
                      <div
                        className="group flex flex-col justify-center rounded-2xl h-[550px] shadow-md cursor-pointer w-full aspect-[9/16] overflow-hidden relative"
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
                                width: '100% !important',
                                height: '100%',
                                border: 'none',
                                borderRadius: '12px',
                                objectFit: 'cover',
                                transform: 'scale(1.25)',
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
                                ref={(el) => {
                                  videoRefs.current[0] = el
                                }}
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
                                preload="auto"
                              >
                                <source
                                  src={data?.testimonial?.thumbnail}
                                  type="video/mp4"
                                />
                                Your browser does not support the video tag.
                              </video>
                            )}

                            {/* Play button that shows on hover - Top right of card */}
                            <div className="absolute top-4 right-4  opacity-0 group-hover:opacity-100 transform !z-10 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
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

                            {/* Content that shows by default and stays visible on hover */}
                            <div className="absolute bottom-0 w-full h-2/3 z-10 flex flex-col justify-end bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.1)_100%),linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.85)_100%)] rounded-b-2xl overflow-hidden">
                              <div className="flex flex-col justify-end w-full pb-6 text-white">
                                <div className="px-6">
                                  <div
                                    className="mb-4"
                                    style={{
                                      height: `48px`,
                                      width: `${
                                        48 *
                                          data?.testimonial?.secondaryLogo
                                            ?.metadata?.dimensions
                                            ?.aspectRatio || 2
                                      }px`,
                                    }}
                                  >
                                    <ImageLoader
                                      image={
                                        data?.testimonial?.secondaryLogo?.url
                                      }
                                      alt={
                                        data?.testimonial?.secondaryLogo?.alt ||
                                        'Company Logo'
                                      }
                                      title={
                                        data?.testimonial?.secondaryLogo
                                          ?.title || 'Company Logo'
                                      }
                                      className="w-full h-full object-contain filter brightness-[132%] contrast-[202%]"
                                    />
                                  </div>

                                  {data?.testimonial?.keyStatement && (
                                    <h3 className="text-base xl:text-lg font-medium">
                                      {Array.isArray(
                                        data.testimonial.keyStatement,
                                      ) &&
                                      data.testimonial.keyStatement.length >
                                        0 ? (
                                        <PortableText
                                          value={data.testimonial.keyStatement}
                                          components={
                                            testimonialDescriptionComponents
                                          }
                                        />
                                      ) : typeof data.testimonial
                                          .keyStatement === 'string' &&
                                        data.testimonial.keyStatement.trim() ? (
                                        <span>
                                          &ldquo;{data.testimonial.keyStatement}
                                          &rdquo;
                                        </span>
                                      ) : null}
                                    </h3>
                                  )}
                                  <div className="h-[1px] w-full bg-white/20 my-3"></div>
                                  <p className="text-sm xl:text-base font-medium">
                                    {data?.testimonial?.name}
                                  </p>
                                  <p className="text-sm text-white/60">
                                    {data?.testimonial?.designation}
                                  </p>
                                </div>
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
                    className="w-full h-full object-cover rounded-[12px] md:rounded-[24px] aspect-[1/1]"
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
