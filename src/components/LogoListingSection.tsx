import Image from 'next/image'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Slider from 'react-slick'

import getTextByReferrer from '~/helpers/getTextByReferrer'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import Button from './common/Button'
import { FormModal } from './common/FormModal'
import ImageLoader from './common/imageLoader/imageLoader'
import { VideoItem, VideoModal } from './common/VideoModal'
import ButtonArrow from './icons/ButtonArrow'
import Container from './structure/Container'
import Section from './structure/Section'
import H2 from './typography/H2'
import Paragraph from './typography/Paragraph'
import VideoPlayer from './common/VideoPlayer'
import SectionHeader from './revamp/components/common/sectionHeader'
import { setImage } from '~/helpers/starRating'




const LogoListingSection = ({ data, refer = null }) => {
  const [openForm, setOpenForm] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  const [isUk, setIsUk] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsUk(router.locale == 'en-GB')
  }, [router.locale])
  const { isDemoPopUpShown } = useContext(BookDemoContext)

  const [isOpen, setIsOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null)
  const handleOpenVideo = (video: VideoItem) => {
    setSelectedVideo(video)
    setIsOpen(true)
  }


 
  return (
    <Section className="py-sm md:py-md md:pb-16">
      <Container>
        <div className="flex flex-col items-center w-full gap-16">
          {/* <div className='flex items-center flex-col gap-4'>
            <span className='flex'>{setImage("5")}</span>
            <SectionHeader
              heading={data?.logoSectionHeader}
              description={data?.logoSectionHeaderDescptn}
              headingSm={true}
            />
          </div> */}

          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 max-w-[1034px]">
            {data?.image &&
              data.image?.length &&
              data?.image?.map((logo: any, i) => {
                return (
                  <Image
                    src={logo.url}
                    alt={logo.altText || 'organization Logo'}
                    title={logo.altText}
                    width={logo?.metadata?.dimensions?.width}
                    height={logo?.metadata?.dimensions?.height}
                    className={`${isUk ? 'h-[52px]' : 'h-10'} w-auto`}
                    key={logo?._id}
                  ></Image>
                )
              })}
          </div>
          {/* <div className="flex gap-4 items-center">
            {refer == 'carestack' ? (
              <Button
                type="primary"
                link={`/demo?region=${router.locale}`}
                locale={false}
                target="_blank"
              >
                <ButtonArrow></ButtonArrow>
                <span className="text-base font-medium">
                  {`Book free demo`}
                </span>
              </Button>
            ) : (
              <Button
                type="primary"
                onClick={() => {
                  setOpenForm(true)
                }}
              >
                <ButtonArrow></ButtonArrow>
                <span className="text-base font-medium">{`Book free demo`}</span>
              </Button>
            )}
          </div> */}
        </div>
        {openForm && (
          <FormModal
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
            data={isDemoPopUpShown}
          />
        )}
      </Container>
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
    </Section>
  )
}

export default LogoListingSection
