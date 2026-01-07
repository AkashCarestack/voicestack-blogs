import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import React from 'react'
import Button from '~/components/common/Button'
import Container from '~/components/structure/Container'
import bgStyle from '~/assets/Bg/image 682.png'
import { descriptionComponents, HeroFeatureComponents, HeroFeatureHeadingComponents, HeroHeadingComponents } from '~/utils/common'
import { urlForImage } from '~/lib/sanity.image'
import Section from '~/components/structure/Section'
import HubspotGenericForm from '~/components/revamp/components/common/hubspotGeneric'
import LightningIcon from '../icons/LightningIcon'

export default function FeatureHero({ data ,type}: { data: any, type?: string }) {
  const value = data?.heroComponent 
  const buttons = value?.bookBtnContent || data?.bookBtnContent
  const heading = value?.heroheading || data?.heroheading
  const description = value?.heroDescription || data?.heroDescription
  const title = value?.heroStrip || data?.heroStrip?.toUpperCase()
  const image = urlForImage(value?.heroImage) || data?.heroImage?.url
  const videoUrl = value?.video && value?.video?.length > 0 ? value?.video[0]?.uploadVideos[0]?.url : null
  const movFileUrl = value?.video && value?.video?.length > 0 ? value?.video[0]?.uploadVideos[0]?.url : null
  const webpFileUrl = value?.video && value?.video?.length > 0 ? value?.video[0]?.uploadVideos[0]?.url : null
  const mp4FileUrl = value?.video && value?.video?.length > 0 ? value?.video[0]?.uploadVideos[0]?.url : null
  return (
    <Section className="relative overflow-hidden" id="FeatureHero" border="b">
      <Container type="V2" className="md:py-24 py-16 overflow-hidden justify-center flex">
        <div className='flex md:flex-row flex-col md:gap-12  max-w-[1240px] w-full gap-6 relative z-10 items-center'>
          <div className="flex flex-col gap-3 relative z-10 flex-1">
            {type === 'partner' ? (
              <div className="flex items-center gap-2 py-[9px] pr-4 pl-[14px] rounded-full border border-[#AEA0FF] self-start bg-white/20 shadow-[-7px_0_10px_0_rgba(251,111,142,0.5),7px_0_10px_0_rgba(74,60,225,0.5)]">
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
              components={type === 'feature' || type === 'partner' ? HeroFeatureComponents : HeroFeatureHeadingComponents}
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
          {data.hubspotFormId &&      
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
          {image && <div className='flex-1  w-full h-full max-w-[481px] max-h-[444px]'>
              <Image className='md:w-[481px] md:h-[444px] w-full h-full object-cover' src={image} alt={heading} width={1000} height={1000} />
            </div>}
            { videoUrl && <div className='flex-1  w-full h-full max-w-[481px] max-h-[444px] bg-transparent'>
              <video 
                className='md:w-[481px] md:h-[444px] w-full h-full object-cover' 
                src={videoUrl}  
                width={1000} 
                height={1000}
                autoPlay
                loop
                muted
                playsInline
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
            </div>}
        </div>
        <div className="hidden z-0 md:block absolute right-0 bottom-0 w-[1000px] h-[738px] pointer-events-none">
          <Image
            className="w-full h-full object-cover"
            alt="bgStyle"
            width={1049}
            height={738}
            src={bgStyle.src}
          />
        </div>
      </Container>
    </Section>
  )
}
