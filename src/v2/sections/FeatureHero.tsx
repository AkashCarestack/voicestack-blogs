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

interface FeatureHeroProps {
  data: any
  type?:string | 'form' | 'feature'
  hideBg?: boolean
}

export default function FeatureHero({ data, type , hideBg = false}: { data: any, type?: string, hideBg?: boolean }) {
  console.log(data, 'data');
  const hubspotFormId = data?.componentData?.hubspotFormId || data?.hubspotFormId
  const value = data?.heroComponent 
  const buttons = value?.bookBtnContent || data?.bookBtnContent
  const heading = value?.heroheading || data?.heroheading
  const description = value?.heroDescription || data?.heroDescription
  const title = value?.heroStrip || data?.heroStrip?.toUpperCase()
  const image = urlForImage(value?.heroImage) || data?.heroImage?.url
  
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
  
  useEffect(() => {
    const handleTouchOutside = (event: TouchEvent | MouseEvent) => {
      const target = event.target as HTMLElement

      const clickedInside = iframeRef.current?.contains?.(target)
      const insideVideoContainer = target.closest('.video-container')

      if (!insideVideoContainer && !clickedInside && playingYoutube) {
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
  return (
    <Section className="relative overflow-hidden" id="FeatureHero" border="b">
      <Container type="V2" className="md:py-24 py-16 overflow-hidden justify-center flex">
        <div className='flex lg:flex-row flex-col md:gap-12  max-w-[1240px] w-full gap-6 relative z-10 items-center'>
          <div className={`flex flex-col gap-3 relative z-10 flex-1  ${type === 'form' ? 'max-w-[606px]' : ''}`}>
            {(type === 'form' || type === 'comparison') ? (
              <div className="flex items-center gap-2 py-[9px] pr-4 pl-[14px] rounded-full border border-[#AEA0FF] lg:self-start self-center bg-white/20 shadow-[-7px_0_10px_0_rgba(251,111,142,0.5),7px_0_10px_0_rgba(74,60,225,0.5)]">
                <LightningIcon className="w-4 h-4" />
                <h2 className="text-center md:text-left text-sm font-geist font-normal leading-[115%] text-gray-950">
                  {title?.toUpperCase()}
                </h2>
              </div>
            ):(
              <h2 className="text-center md:text-left text-base font-geist font-medium leading-[150%] tracking-[0.8px] text-gray-950 uppercase">
                {title?.toUpperCase()}
              </h2>
            )}
            <PortableText
              value={heading}
              components={type === 'feature' ? HeroFeatureComponents : type === 'form' ? ComparisonHeroH1 : HeroFeatureHeadingComponents}
            />
            <PortableText
              value={description}
              components={descriptionComponents}
            />
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
                <HubspotGenericForm
                  formId={data?.hubspotFormId || 'f2fbfea3-a1e5-4e17-a506-a9d341a45458'}
                  // formId={'f2fbfea3-a1e5-4e17-a506-a9d341a45458'}
                  portalId="4832409"
                  onFormSubmit={() => {}}
                  onFormReady={() => {}}
                />
              </div>
            </div>
          }
          {image && (
            <div className='flex-1  w-full h-full max-w-[481px] max-h-[444px]'>
              <Image className='md:w-[481px] md:h-[444px] w-full h-full object-cover' src={image} alt={heading} width={1000} height={1000} />
            </div>
          )}
          {hasVideo && (
            <div className='flex-1 w-full h-full max-w-[481px] max-h-[444px] bg-transparent video-container'>
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
                          className="absolute h-full w-full object-cover md:w-[481px] md:h-[444px]"
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
                          className="absolute h-full w-full object-cover md:w-[481px] md:h-[444px]" 
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
                      className="absolute h-full w-full object-cover md:w-[481px] md:h-[444px]"
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
                      className="absolute h-full w-full object-cover md:w-[481px] md:h-[444px]" 
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
                  className='md:w-[481px] md:h-[444px] w-full h-full object-cover rounded-[12px] md:rounded-[24px]'
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
        {!hideBg &&
        <div className="hidden z-0 md:block absolute right-0 bottom-0 w-[1000px] h-[738px] pointer-events-none">
          <Image
            className="w-full h-full object-cover"
            alt="bgStyle"
            width={1049}
            height={738}
            src={bgStyle.src}
          />
        </div>
    }
      </Container>
    </Section>
  )
}
