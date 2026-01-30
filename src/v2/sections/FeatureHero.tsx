import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import bgStyle from '~/assets/Bg/image 682.png'
import { ComparisonHeroH1, descriptionComponents, HeroFeatureComponents, HeroFeatureHeadingComponents, HeroHeadingComponents } from '~/utils/common'
import { urlForImage } from '~/lib/sanity.image'
import Section from '~/components/structure/Section'
import HubspotGenericForm from '~/components/revamp/components/common/hubspotGeneric'
import LightningIcon from '../icons/LightningIcon'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Anchor from '~/components/common/anchor'
import PartnerHubspotForm from '../components/common/PartnerHubspotForm'
import Link from 'next/link'
import AppleIcon from '~/assets/AppleIcon'
import PlayIcon from '~/assets/PlayIcon'
import VoicestackLogo from 'public/assets/voicestack-logo.svg'

interface FeatureHeroProps {
  data: any
  type?:string | 'form' | 'feature' | 'partner'
  hideBg?: boolean
  isCentered?: boolean
  pageType?: string | 'download-app'
  appStoreLinks?: any
}

export default function FeatureHero({ data, type , hideBg = false, isCentered = false ,pageType = '', appStoreLinks = ""}: FeatureHeroProps) {
  
  const hubspotFormId = data?.componentData?.hubspotFormId || data?.hubspotFormId
  const meetingLink = data?.componentData?.meetingLink || data?.meetingLink || data?.demoMeetingLink
  const value = data?.heroComponent 
  const buttons = value?.bookBtnContent || data?.bookBtnContent
  const heading = value?.heroheading || data?.heroheading
  const description = value?.heroDescription || data?.heroDescription
  const title = value?.heroStrip || data?.heroStrip?.toUpperCase()
  const image = urlForImage(value?.heroImage) || data?.heroImage?.url
  
  // Extract testimonial data 
  const testimonial = value?.testimonial || data?.testimonial
  
  // Extract video data
  const videoData = value?.video && value?.video?.length > 0 ? value?.video[0] : null
  const videoId = videoData?.videoId || null
  const externalUrl = videoData?.externalUrl || null
  const thumbnail = videoData?.thumbnail || null
  
  // Extract different video formats from uploadVideos array
  const movFile = videoData?.uploadVideos?.find((e: any) => e.type === 'mov')?.url
  const webpFile = videoData?.uploadVideos?.find((e: any) => e.type === 'webm')?.url
  const mp4File = videoData?.uploadVideos?.find((e: any) => e.type === 'mp4')?.url
  
  const [movFileUrl, setMovFile] = useState<string | undefined>(
    videoData?.uploadVideos?.find((e: any) => e.type === 'mov')?.url,
  )
  const [webpFileUrl, setWebpFile] = useState<string | undefined>(
    videoData?.uploadVideos?.find((e: any) => e.type === 'webm')?.url,
  )
  const [mp4FileUrl, setMp4File] = useState<string | undefined>(
    videoData?.uploadVideos?.find((e: any) => e.type === 'mp4')?.url,
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
  
  // YouTube video handling
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [playingYoutube, setPlayingYoutube] = useState<boolean>(false)
  
  // Testimonial description components for PortableText
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
  
  const handleVideoClick = () => {
    if (videoId) {
      // For YouTube videos - stop any playing thumbnail video first
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      setPlayingYoutube(true)
    } else if (externalUrl) {
      // For external links, open in new tab
      window.open(externalUrl, '_blank')
    } else {
      // For regular video files
      const video = videoRef.current
      if (video) {
        video.currentTime = 0
        video.play()
      }
    }
  }
  
  // Handle testimonial YouTube video click
  const handleTestimonialVideoClick = () => {
    const testimonialVideoId = testimonial?.video?.[0]?.videoId
    if (testimonialVideoId) {
      // Stop any playing thumbnail video first
      const video = videoRef.current
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      setPlayingYoutube(true)
    }
  }
  
  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent | MouseEvent) => {
      const target = event.target as HTMLElement

      const clickedInside = iframeRef.current?.contains?.(target)
      const insideVideoContainer = target.closest('.video-container')
      const insideTestimonialCard = target.closest('.testimonial-card')

      if (!insideVideoContainer && !insideTestimonialCard && !clickedInside && playingYoutube) {
        const iframe = iframeRef.current
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
        setPlayingYoutube(false)
      }
    }

    document.addEventListener('touchstart', handleTouchOutside, true)
    document.addEventListener('mousedown', handleTouchOutside, true)

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside, true)
      document.removeEventListener('mousedown', handleTouchOutside, true)
    }
  }, [playingYoutube])

  const videoKey = useMemo(
    () => `${webpFileUrl}-${movFileUrl}-${mp4FileUrl}`,
    [webpFileUrl, movFileUrl, mp4FileUrl],
  )
  
  // Check if we have any video content
  const hasVideo = videoId || externalUrl || movFileUrl || webpFileUrl || mp4FileUrl
  
  // Check if we have testimonial with video
  const hasTestimonial = testimonial && testimonial?.video?.[0]?.videoId
  
  // Determine heading level based on title presence
  const headingLevel = title ? 'h2' : 'h1'
  
  // Helper function to extract text content from React children
  const extractText = (children: React.ReactNode): string => {
    if (!children) return ''
    if (typeof children === 'string') return children
    if (typeof children === 'number') return String(children)
    if (Array.isArray(children)) {
      return children.map(child => extractText(child)).join('')
    }
    if (typeof children === 'object' && children !== null && 'props' in children) {
      return extractText(children.props?.children)
    }
    return ''
  }
  
  // Create dynamic component configuration
  const dynamicHeroFeatureComponents = {
    ...HeroFeatureComponents,
    block: {
      ...HeroFeatureComponents.block,
      normal: ({ children }: { children: React.ReactNode }) => {
        // Don't render if children is empty or only contains whitespace
        const textContent = extractText(children).trim()
        if (!textContent || textContent.length === 0) return null
        return React.createElement(
          headingLevel,
          {
            className: `text-gray-950 text-center font-manrope xl:text-[56px] md:text-5xl  text-3xl font-bold !leading-[107.143%] max-w-3xl ${isCentered ? 'md:text-center' : ' md:text-left'}`,
          },
          children
        )
      },
      h2: ({ children }: { children: React.ReactNode }) => {
        // Don't render if children is empty or only contains whitespace
        const textContent = extractText(children).trim()
        if (!textContent || textContent.length === 0) return null
        return React.createElement(
          headingLevel,
          {
            className: `text-gray-950 text-center font-manrope xl:text-[56px] md:text-5xl text-3xl font-bold leading-[111.111%] max-w-[711px] ${isCentered ? 'md:text-center' : ' md:text-left'}`,
          },
          children
        )
      },
    },
  }
  
  // Check if heading has content before rendering
  const hasHeadingContent = heading && (
    (Array.isArray(heading) && heading.length > 0 && heading.some((block: any) => {
      if (!block?.children) return false
      return block.children.some((child: any) => {
        const text = child?.text || ''
        return text.trim().length > 0
      })
    })) ||
    (typeof heading === 'string' && heading.trim().length > 0)
  )
  
  return (
    <Section className="relative overflow-hidden" id="FeatureHero" border="b">
      <Container type="V2" className={`md:py-24 py-16 overflow-hidden justify-center flex ${pageType === 'download-app' ? 'flex-col' : ''}`}>
        <div className='flex lg:flex-row flex-col md:gap-12  max-w-[1240px] w-full gap-6 relative z-10 items-center'>
          <div className={`flex flex-col gap-3 relative z-10 flex-1  ${type === 'form' ? 'max-w-[606px]' : ''} ${isCentered ? 'text-center items-center' : ''}`}>
            {title && (
              (type === 'form' || type === 'comparison') ? (
                <div className="flex items-center gap-2 py-[9px] pr-4 pl-[14px] rounded-full border border-[#AEA0FF] lg:self-start self-center bg-white/20 shadow-[-7px_0_10px_0_rgba(251,111,142,0.5),7px_0_10px_0_rgba(74,60,225,0.5)]">
                  <LightningIcon className="w-4 h-4" />
                  <h1 className="text-center md:text-left text-sm font-geist font-normal leading-[115%] text-gray-950">
                    {title?.toUpperCase()}
                  </h1>
                </div>
              ):(
                <h1 className={`${type === 'partner' ? 'sr-only' : ''} text-base font-geist font-medium leading-[150%] tracking-[0.8px] text-gray-950 uppercase`}>
                  {title?.toUpperCase()}
                </h1>
              )
            )}
            {type === 'partner' && (
            data?.heroImageSecondary?.url ? (
              <div className="flex mb-4 md:justify-start justify-center">
                <Image
                  src={data?.heroImageSecondary?.url}
                  alt={data?.heroImageSecondary?.alt || "VoiceStack"}
                  title={data?.heroImageSecondary?.title || "VoiceStack"}
                  className={`md:h-[42px] h-[32px] w-auto`}
                  width={500}
                  height={58}
                />
              </div>
            ):(
              <div className="flex mb-4 md:justify-start justify-center">
                <Image
                  src={VoicestackLogo}
                  alt={"VoiceStack"}
                  title={"VoiceStack"}
                  className={`md:h-[48px] h-[48px] w-auto`}
                  width={280}
                  height={70}
                />
              </div>
            ))}
            {hasHeadingContent && (
              <PortableText
                value={heading}
                // components={type === 'feature' ? HeroFeatureComponents : type === 'form' ? ComparisonHeroH1 : HeroFeatureHeadingComponents}
                components={dynamicHeroFeatureComponents}
              />
            )}
            {description && (
              <div className={`${isCentered ? 'text-center [&>p]:text-center' : ''} flex flex-col gap-3`}>
                <PortableText
                  value={description}
                  components={descriptionComponents}
                />
              </div>
            )}
            <div className="flex flex-col md:flex-row md:gap-[18px] items-center md:mt-5 mt-4 gap-3">
              {buttons &&
                buttons.length &&
                buttons.map((button: any) => (
                  <Button
                    key={button._key}
                    type={button.buttonType}
                    link={button.buttonLink}
                  >
                    <span>{button?.buttonText}</span>
                  </Button>
                ))}
            </div>

            {/*  */}
          </div>
          {hubspotFormId && 
            <div id="demo" className="scroll-m-14 min-h-[610px] scroll-mt-28 sticky top-20 p-8 rounded-[12px] md:rounded-[24px] bg-white w-full max-w-[537px] md:p-12">
              <h3 className="md:text-3xl text-2xl font-semibold mb-4 font-geist text-[#030712]">
                Book a Demo
              </h3>
              <div className="mt-4 vs-button">
                <PartnerHubspotForm
                  formId={data?.hubspotFormId}
                  // formId={'f2fbfea3-a1e5-4e17-a506-a9d341a45458'}
                  meetingLink={meetingLink}
                  portalId="4832409"
                />
              </div>
            </div>
          }
          {image && !hasVideo && !hasTestimonial && (
            <div className='flex-1  w-full h-full max-w-[550px] max-h-[550px]'>
              <Image className='max-w-[550px] max-h-[550px] w-full h-full object-cover' src={image} alt={heading} width={1000} height={1000} />
            </div>
          )}
          {/* Testimonial Section with YouTube Video */}
          {hasTestimonial && !hasVideo && !image && (
            <div className="max-w-[550px] max-h-[550px] leading-none flex-1 flex justify-center lg:justify-end items-start relative testimonial-card">
              <div className="absolute right-auto left-1/2 lg:left-auto lg:right-0 top-[0] bg-[#4A3CE1] opacity-10 rounded-[12px] md:rounded-[22px] -translate-x-1/2 lg:translate-x-0 rotate-[-7.7deg] scale-90 aspect-[9/16] lg:aspect-[380/550] w-[300px] lg:w-[380px] shrink-0 origin-bottom-left"></div>
              <div className="relative rounded-[8px] md:rounded-[16px] aspect-[9/16] lg:aspect-[380/550] w-[320px] lg:w-[380px] overflow-hidden shrink-0">
                <div
                  className="group flex flex-col justify-center rounded-2xl h-[550px] shadow-md cursor-pointer w-full aspect-[9/16] overflow-hidden relative"
                  onClick={handleTestimonialVideoClick}
                >
                  {playingYoutube && testimonial?.video?.[0]?.videoId ? (
                    <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden">
                      <iframe
                        ref={(el) => {
                          if (el) iframeRef.current = el
                        }}
                        src={`https://www.youtube-nocookie.com/embed/${testimonial?.video?.[0]?.videoId}?playlist=${testimonial?.video?.[0]?.videoId}&loop=1&autoplay=1&modestbranding=1&rel=0&disablekb=1&fs=0&controls=0&enablejsapi=1`}
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
                      {testimonial?.thumbnail && (
                        <video
                          ref={(el) => {
                            if (el) videoRef.current = el
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
                            src={testimonial?.thumbnail}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      {/* Play button that shows on hover - Top right of card */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform !z-10 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <div
                          className="rounded-full flex items-center cursor-pointer justify-center w-24 h-10 border border-white/20 bg-black/15 text-white hover:bg-black/25 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleTestimonialVideoClick()
                          }}
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
                            {testimonial?.secondaryLogo?.url && (
                              <div
                                className="mb-4"
                                style={{
                                  height: `48px`,
                                  width: `${
                                    48 *
                                      (testimonial?.secondaryLogo?.metadata?.dimensions?.aspectRatio || 2)
                                  }px`,
                                }}
                              >
                                <ImageLoader
                                  image={testimonial?.secondaryLogo?.url}
                                  alt={testimonial?.secondaryLogo?.alt || 'Company Logo'}
                                  title={testimonial?.secondaryLogo?.title || 'Company Logo'}
                                  className="w-full h-full object-contain filter brightness-[132%] contrast-[202%]"
                                />
                              </div>
                            )}

                            {testimonial?.keyStatement && (
                              <h3 className="text-base xl:text-lg font-medium">
                                {Array.isArray(testimonial.keyStatement) &&
                                testimonial.keyStatement.length > 0 ? (
                                  <PortableText
                                    value={testimonial.keyStatement}
                                    components={testimonialDescriptionComponents}
                                  />
                                ) : typeof testimonial.keyStatement === 'string' &&
                                  testimonial.keyStatement.trim() ? (
                                  <span>
                                    &ldquo;{testimonial.keyStatement}&rdquo;
                                  </span>
                                ) : null}
                              </h3>
                            )}
                            <div className="h-[1px] w-full bg-white/20 my-3"></div>
                            <p className="text-sm xl:text-base font-medium">
                              {testimonial?.name}
                            </p>
                            <p className="text-sm text-white/60">
                              {testimonial?.designation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {hasVideo && !hasTestimonial && (
            <div className='flex-1 w-full h-full max-w-[550px] max-h-[550px] bg-transparent video-container'>
              {videoId ? (
                // YouTube video handling
                <div
                  className="group relative w-full h-full rounded-[12px] md:rounded-[24px] overflow-hidden cursor-pointer"
                  onClick={handleVideoClick}
                >
                  {playingYoutube ? (
                    <div className="absolute inset-0 w-full h-full rounded-[12px] md:rounded-[24px] overflow-hidden">
                      <iframe
                        ref={(el) => {
                          if (el) iframeRef.current = el
                        }}
                        src={`https://www.youtube-nocookie.com/embed/${videoId}?playlist=${videoId}&loop=1&autoplay=1&modestbranding=1&rel=0&disablekb=1&fs=0&controls=0&enablejsapi=1`}
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
                    <div className="relative w-full h-full rounded-[12px] md:rounded-[24px] overflow-hidden">
                      {/* Thumbnail Video - plays on hover */}
                      {thumbnail ? (
                        <video
                          ref={(el) => {
                            if (el) videoRef.current = el
                          }}
                          style={{
                            backgroundColor: 'transparent',
                            backgroundImage: 'none',
                            backgroundSize: 0,
                            backgroundPosition: 0,
                            backgroundRepeat: 'no-repeat',
                            objectFit: 'cover',
                          }}
                          className="absolute h-full w-full object-cover max-w-[550px] max-h-[550px]"
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="auto"
                        >
                          <source
                            src={thumbnail}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : image ? (
                        <Image 
                          className="absolute h-full w-full object-cover max-w-[550px] max-h-[550px]" 
                          src={image} 
                          alt={heading} 
                          width={1000} 
                          height={1000} 
                        />
                      ) : null}

                      {/* Play button that shows on hover */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform !z-10 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <div
                          className="rounded-full flex items-center cursor-pointer justify-center w-24 h-10 border border-white/20 bg-black/15 text-white hover:bg-black/25 transition-colors duration-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleVideoClick()
                          }}
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
                    </div>
                  )}
                </div>
              ) : externalUrl ? (
                // External link handling
                <div
                  className="group relative w-full h-full rounded-[12px] md:rounded-[24px] overflow-hidden cursor-pointer"
                  onClick={() => window.open(externalUrl, '_blank')}
                >
                  {thumbnail ? (
                    <video
                      ref={(el) => {
                        if (el) videoRef.current = el
                      }}
                      style={{
                        backgroundColor: 'transparent',
                        backgroundImage: 'none',
                        backgroundSize: 0,
                        backgroundPosition: 0,
                        backgroundRepeat: 'no-repeat',
                        objectFit: 'cover',
                      }}
                      className="absolute h-full w-full object-cover max-w-[550px] max-h-[550px]"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="auto"
                    >
                      <source
                        src={thumbnail}
                        type="video/mp4"
                      />
                      Your browser does not support the video tag.
                    </video>
                  ) : image ? (
                    <Image 
                      className="absolute h-full w-full object-cover max-w-[550px] max-h-[550px]" 
                      src={image} 
                      alt={heading} 
                      width={1000} 
                      height={1000} 
                    />
                  ) : null}
                  
                  {/* Play button that shows on hover */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform !z-10 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <div
                      className="rounded-full flex items-center cursor-pointer justify-center w-24 h-10 border border-white/20 bg-black/15 text-white hover:bg-black/25 transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation()
                        window.open(externalUrl, '_blank')
                      }}
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
                </div>
              ) : (
                // Regular uploaded video files
                <video
                  key={videoKey}
                  ref={(el) => {
                    if (el) videoRef.current = el
                  }}
                  className='max-w-[550px] max-h-[550px] w-full h-full object-cover rounded-[12px] md:rounded-[24px]'
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
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
              )}
            </div>
          )}
        </div>
        {!hideBg && (
          <div className="hidden z-0 md:block absolute right-0 bottom-0 w-[1000px] h-[738px] pointer-events-none">
            <Image
              className="w-full h-full object-cover"
              alt="bgStyle"
              width={1049}
              height={738}
              src={bgStyle.src}
            />
          </div>
        )}

        {/******************* 
         *  Only for download page case - to show download app buttons **
        **************/}


        {pageType === 'download-app' && appStoreLinks && (appStoreLinks.appStore || appStoreLinks.googlePlay) && (
          <div className="w-full flex justify-center">
            <div className="flex flex-col gap-4 items-center md:pt-12 pt-[10px]">
              {appStoreLinks.downloadText && (
                <p className="text-[#030712] text-lg font-medium leading-[160%] text-center">
                  {appStoreLinks.downloadText}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* App Store Button */}
                {appStoreLinks.appStore && (
                  <Link
                    href={appStoreLinks.appStore}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 px-2 py-2 pr-6 rounded-[18px] border border-white/20 bg-white hover:bg-white/25 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-[62px] h-[62px] rounded-xl bg-black/10">
                      <AppleIcon />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-gray-900 text-sm font-normal uppercase leading-[1.45]">
                        Download on
                      </span>
                      <span className="text-gray-900 text-xl font-semibold leading-[1.45]">
                        App Store
                      </span>
                    </div>
                  </Link>
                )}

                {/* Google Play Button */}
                {appStoreLinks.googlePlay && (
                  <Link
                    href={appStoreLinks.googlePlay}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-6 px-2 py-2 pr-6 rounded-[18px] border border-white/20 bg-white hover:bg-white/25 transition-all duration-300"
                  >
                    <div className="flex items-center justify-center w-[62px] h-[62px] rounded-xl bg-black/10">
                      <PlayIcon />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[#030712] text-sm font-normal uppercase leading-[1.45]">
                        GET IT ON
                      </span>
                      <span className="text-[#030712] text-xl font-semibold leading-[1.45]">
                        Google Play
                      </span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}

