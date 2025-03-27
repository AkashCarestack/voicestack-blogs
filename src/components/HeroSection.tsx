import React, { useContext, useEffect, useState } from 'react'
import Section from './structure/Section'
import Button from './common/Button'
import ButtonArrow from './icons/ButtonArrow'
import Container from './structure/Container'
import H1 from './typography/H1'
import { VideoItem, VideoModal } from './common/VideoModal'
import device from 'public/assets/voicestack-device.png'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { FormModal } from './common/FormModal'
import VideoPlayIconWhite from './icons/VideoPlayIconWhite'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import { useSearchParams } from 'next/navigation'
import getTextByReferrer from '~/helpers/getTextByReferrer'
import { useRouter } from 'next/router'

const HeroSection = ({ data, refer = null, video }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const router = useRouter();
  const videoId = router.locale == "en" ? "3CsThXKvcvRrR3hwRsWWJY" : "Hj4GYLXARVjqQEnaejq3Bz";
  // console.log(video[0]);
  // console.log({data});
  
    
  const overviewVideo: VideoItem = {
    videoPlatform: 'vidyard',
    videoId: videoId,
  }

  const [activeIndex, setActiveIndex] = useState(0)
  const [wordIndex, setWordIndex] = useState(0)
  const words = data?.heroTitleStaticDynamic[activeIndex]?.split(' ');
  const searchParams = useSearchParams();
  const source2 = searchParams.get("source"); // Get 'source' param from URL

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-white font-inter text-lg font-medium leading-[160%] text-center max-w-[600px] w-full">
          {children}
        </p>
      ),
    },
  }
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext)
  
  useEffect(() => {
    setIsDemoPopUpShown(data);
    if (wordIndex < words?.length) {
      const wordInterval = setTimeout(() => {
        setWordIndex(wordIndex + 1)
      }, 100)
      return () => clearTimeout(wordInterval)
    } else {
      const messageInterval = setTimeout(() => {
        setActiveIndex((activeIndex + 1) % data?.heroTitleStaticDynamic?.length) // Loop through messages
        setWordIndex(0)
      }, 3000)
      return () => clearTimeout(messageInterval)
    }
  }, [
    wordIndex,
    activeIndex,
    words?.length,
    data,
    setIsDemoPopUpShown,
    data?.heroTitleStaticDynamic?.length,
  ])

  useEffect(()=>{
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src =
        "https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js";
      document.body.appendChild(script);
  },[])
// console.log(data?.heroTitleReferrer.filter((item:any)=> item['_key'] == "cs"));

  return (
    <Section className="pt-md md:pt-lg bg-vs-blue" childClass="flex">
      <Container>
        <div className="relative w-full flex items-center flex-col md:pt-sm pt-0">
        {/* <div
          className="meetings-iframe-container"
          data-src="https://meetings.hubspot.com/carestack-dan/cspay?embed=true"
        ></div> */}
          <div className="flex gap-8 items-center pb-10 flex-col max-w-[910px] w-full">
            <div className="flex flex-col items-center w-full gap-5">
              <div className="flex py-2.5 px-[17px] justify-center items-center gap-2 rounded-full border border-white/10 bg-gray-50/5">
                <span className="flex text-white text-center text-xs font-medium leading-[120%] tracking-[0.98px] uppercase">
                  {data?.heroStripHeader}
                </span>
              </div>
              <H1 className="text-center w-full">
                {/* {source == "website" ? ( */}
                  <span className="block [&>span]:text-vs-lemon-green"
                    dangerouslySetInnerHTML={{__html:getTextByReferrer(refer, data?.heroTitleReferrer || [])}}
                    // dangerouslySetInnerHTML={{__html:data?.heroTitleReferrer.filter((item:any)=> item['_key'] == "cs")[0].value}}
                  ></span>
                {/* ):(
                  <>
                    <span className="block text-vs-lemon-green">
                      {data?.heroStrip ? data.heroStrip : ''}
                    </span>
                    <span className="block">{data?.heroTitleStatic}</span>
                  </>
                )} */}

                <div className="relative h-20 overflow-hidden">
                  {data?.heroTitleStaticDynamic?.map((message, index) => (
                    <span
                      key={index}
                      className={`block absolute w-full text-center  ${
                        index === activeIndex
                          ? 'opacity-100 transition-opacity duration-500'
                          : 'opacity-0'
                      }`}
                    >
                      {message.split(' ').map((word, i) => (
                        <span
                          key={i}
                          className={`inline-block translate-y-full opacity-0 ${
                            i < wordIndex ? 'animate-pullUp' : ''
                          }`}
                          style={{ animationDelay: `${i * 0.2}s` }}
                        >
                          {word}&nbsp;
                        </span>
                      ))}
                    </span>
                  ))}
                </div>
              </H1>
            </div>

            <div className="flex flex-col gap-8 items-center">
              <PortableText
                components={components}
                key={data?._rev}
                value={data?.heroDescription}
              />
              {/* <HubSpotForm></HubSpotForm> */}

              <div className="flex gap-4 flex-col md:flex-row items-center">
                {refer == "carestack" ? (
                  <Button type="primaryWhite" link={`/demo?region=${router.locale}`} locale={false} target='_blank'>
                    <ButtonArrow></ButtonArrow>
                    <span className="text-base font-medium">
                      {data?.bookBtnContent}
                    </span>
                  </Button>
                ):(

                <Button type="primaryWhite" onClick={() => {setOpenForm(true)}}>
                  <ButtonArrow></ButtonArrow>
                  <span className="text-base font-medium">
                    {data?.bookBtnContent}
                  </span>
                </Button>
                )}
                {video && (
                  <Button
                    type="video"
                    onClick={() => {
                      setIsOpen(true)
                    }}
                  >
                    <VideoPlayIconWhite></VideoPlayIconWhite>
                    <span className="text-base font-medium">{`Watch overview`}</span>
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="relative w-full fade-in">
            {/* <Image src={device} alt='device'></Image> */}
            <div className={`relative pt-[58%] lg:pt-0 ${data.heroImageSecondary ? 'lg:h-[480px]' : 'lg:h-[520px]'} overflow-hidden w-full`}>
              {data.heroImage && (
                
                <div className={`absolute left-0 top-[23%] lg:top-[80px] ${data.heroImageSecondary ? 'w-[85%]' : 'w-[100%]'}`}>
                  <Image
                    className="w-full h-full object-cover"
                    src={data.heroImage.url}
                    title="VoiceStack"
                    alt={data.heroImage.altText}
                    width={data.heroImage.metadata.dimensions.width}
                    height={data.heroImage.metadata.dimensions.height}
                  ></Image>
                </div>
              )}
              {data.heroImageSecondary && (
                <div className="absolute right-0 bottom-[-40px] lg:bottom-auto lg:top-0 min-w-[105px] w-[30%] md:w-[25%]">
                  <Image
                    className="w-full h-full object-cover"
                    src={data.heroImageSecondary.url}
                    alt="voicemail"
                    title="Voice Mail"
                    width={data.heroImageSecondary.metadata.dimensions.width}
                    height={data.heroImageSecondary.metadata.dimensions.height}
                  ></Image>
                </div>
              )}
            </div>

            <div className="absolute left-[4%] md:left-0 -bottom-[45px] md:-bottom-[90px] min-w-[220px] w-[38.5%]">
              <Image
                className="w-full h-full object-cover"
                src={device}
                alt="voicestack device"
                title='VoiceStack'
              ></Image>
            </div>
          </div>
        </div>
        <div>
          {isOpen && (
            <VideoModal
              refer={refer}
              isPopup={true}
              // videoDetails={overviewVideo}
              videoDetails={video[0]}
              className={`pt-9 flex items-start`}
              onClose={() => setIsOpen(false)}
              openForm ={() => setOpenForm(true)}
              hasDemoBanner = {true}
            />
          )}
          {openForm && (
            <FormModal
              className={`pt-9  flex items-start`}
              onClose={() => setOpenForm(false)}
              data={isDemoPopUpShown}
            />
          )}
        </div>
      </Container>
    </Section>
  )
}

export default HeroSection
