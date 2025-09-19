import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

import SuperChargeIcon from '~/components/icons/superCharge'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import Button from '../../common/Button'
import { VideoItem } from '../../common/VideoModal'
import Container from '../../structure/Container'
import VideoPlayers from '~/components/common/VideoPlayer'
import { PortableText } from '@portabletext/react'
import { FormModal } from '~/components/common/FormModal'

const HeroSection = ({ data, refer = null, video }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [openForm, setOpenForm] = useState(false)
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
  const source2 = searchParams.get('source') // Get 'source' param from URL

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-3xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope text-gray-950">
          {children}
        </p>
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
        <p className="text-lg text-gray-950 leading-[28px] max-w-[607px] line-clamp-2 self-stretch">
          {children}
        </p>
      ),
    },
  }
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext)

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
    document.body.appendChild(script)
  }, [])

  return (
    <section className="min-h-screen bg-[#F9F9F9] px-12 pt-3 pb-6 font-geist">
      <div className=" rounded-[24px] bg-[linear-gradient(270deg,rgba(202,197,255,0.70)_0%,rgba(202,197,255,0.15)_51.44%,rgba(202,197,255,0.20)_100%)] justify-center">
        <Container className="justify-center py-12">
          <div className="">
            <div className="flex flex-col lg:flex-row justify-between lg:gap-24 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-3 flex-1">
                {/* Feature Tag */}
                <div className="inline-flex items-center space-x-2 rounded-full border border-[rgba(174,160,255,0.20)] bg-[rgba(174,160,255,0.20)] py-[9px] pl-4 pr-[14px]">
                  <SuperChargeIcon />
                  <span className="text-sm font-medium text-gray-950">
                    {data?.heroStrip}
                  </span>
                </div>

                {/* Main Headline */}
                <div className="space-y-4">
                  <h1 className="text-3xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
                    <PortableText
                      value={data?.heroheading}
                      components={components}
                    />
                  </h1>
                </div>

                {/* Description */}
                <PortableText
                  value={data?.heroDescription}
                  components={descriptionComponents}
                />

                {data?.bookBtnContent && (
                  <div className="flex gap-4 pt-5">
                    <Button type="primary"  onClick={() => { setOpenForm(true) }}>
                      <span className="rounded-[8px] border border-white/10 bg-[#B5EB92] px-6 py-2.5 text-black font-medium">
                        {data?.bookBtnContent[0]?.buttonText ||
                          'Book Free Demo'}
                      </span>
                    </Button>
                    <Button type="secondary">
                      {data?.bookBtnContent[1]?.buttonText || 'See Pricing'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Content - Video Section */}
              <div className="relative">
                <div className="relative w-full h-[550px] rounded-[24px] overflow-hidden max-w-[537px]">
                  <VideoPlayers
                    video={video[0]}
                    thumbnail={video[0]?.videoThumbnail}
                  />
                </div>
              </div>
            </div>
          </div>
          {openForm && (
            <FormModal
              className={`pt-9  flex items-start`}
              onClose={() => setOpenForm(false)}
              data={isDemoPopUpShown}
            />
          )}
        </Container>
      </div>
    </section>
  )
}

export default HeroSection
