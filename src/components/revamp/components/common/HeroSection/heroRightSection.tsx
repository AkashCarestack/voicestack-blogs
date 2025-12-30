import { PortableText } from "@portabletext/react"
import { useEffect, useMemo, useRef, useState } from "react"
import ImageLoader from "~/components/common/imageLoader/imageLoader"
import HubspotGenericForm from "../hubspotGeneric"

export default function HeroRightSection({ data }: { data: any }) {

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
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([])
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const [playingYoutubeIndex, setPlayingYoutubeIndex] = useState<number | null>(
    null,
  )
  const handleVideoClick = (index: number, videoId: string) => {
    if (videoId) {
      // For YouTube videos - stop any playing thumbnail video first
      const video = videoRefs.current[index]
      if (video) {
        video.pause()
        video.currentTime = 0
      }
      setPlayingYoutubeIndex(index)
    } else {
      // For regular video files
      const video = videoRefs.current[index]
      if (video) {
        video.currentTime = 0
        video.play()
      }
    }
  }
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
        setPlayingYoutubeIndex(null)
      }
    }

    document.addEventListener('touchstart', handleTouchOutside, true)
    document.addEventListener('mousedown', handleTouchOutside, true)

    return () => {
      document.removeEventListener('touchstart', handleTouchOutside, true)
      document.removeEventListener('mousedown', handleTouchOutside, true)
    }
  }, [playingYoutubeIndex])

  const videoKey = useMemo(
    () => `${webpFileUrl}-${movFileUrl}-${mp4FileUrl}`,
    [webpFileUrl, movFileUrl, mp4FileUrl],
  )
  return (
    <>
    {data?.hubspotFormId ? (
      <div id="demo" className="scroll-m-14 min-h-[760px] scroll-mt-28 sticky top-20 p-8 rounded-[12px] md:rounded-[24px] bg-white w-full max-w-[537px] md:p-12 md:my-12 lg:my-16">
        <h3 className="md:text-3xl text-2xl font-semibold mb-4 font-geist text-[#030712]">
          Book a Demo
        </h3>
        <div className="mt-4 vs-button">
          <HubspotGenericForm
            formId={data?.hubspotFormId || 'f2fbfea3-a1e5-4e17-a506-a9d341a45458'}
            portalId="4832409"
            onFormSubmit={() => {}}
            onFormReady={() => {}}
          />
        </div>
      </div>
    ) : (
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
              <div className="relative rounded-[8px] md:rounded-[16px] aspect-[9/16] lg:aspect-[380/550] w-[320px] lg:w-[380px] overflow-hidden shrink-0">
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
    )}
    </>
  )
}