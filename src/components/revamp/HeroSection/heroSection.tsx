import { PortableText } from '@portabletext/react'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'

import { FormModal } from '~/components/common/FormModal'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import VideoPlayers from '~/components/common/VideoPlayer'
import SuperChargeIcon from '~/components/icons/superCharge'
import { BookDemoContext } from '~/providers/BookDemoProvider'

import Button from '../../common/Button'
import { VideoItem } from '../../common/VideoModal'
import Container from '../../structure/Container'

const HeroSection = ({ data, refer = null, video, page }) => {
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
        <p className="text-lg text-gray-950 leading-[28px] line-clamp-2 self-stretch font-normal">
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
          <li className="flex gap-3 py-[14px] text-base text-gray-950 leading-[24px] border-b" style={{ borderColor: '#0307121A' }}>
          <span className='mt-1'>
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
    <section className={`${page == "home" ? "px-4 xl:px-12": ""} bg-[#F9F9F9]  font-geist`}>
      <div className={`${page == "home" ? "rounded-[24px] ": ""} bg-[linear-gradient(270deg,rgba(202,197,255,0.70)_0%,rgba(202,197,255,0.15)_51.44%,rgba(202,197,255,0.20)_100%)] justify-center`}>
        <Container className="justify-center py-12">
          <div className="">
            <div className="flex flex-col lg:flex-row justify-between lg:gap-24 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-3 flex-1 max-w-[607px] w-full justify-center lg:justify-start">
                {/* Feature Tag */}
                {page === 'home' ? (
                  <div className="flex w-fit mx-auto lg:mx-0 items-center space-x-2 rounded-full border border-[rgba(174,160,255,0.20)] bg-[rgba(174,160,255,0.20)] py-[9px] pl-4 pr-[14px]">
                    <SuperChargeIcon />
                    <span className="text-sm font-medium text-gray-950">
                      {data?.heroStrip}
                    </span>
                  </div>
                ) : (
                  <div className='text-center lg:text-left'>
                    <span className="text-base font-medium text-gray-950 uppercase">
                      {data?.heroStrip}
                    </span>
                  </div>
                )}

                {/* Main Headline */}
                <div className="space-y-4 text-center lg:text-left">
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
                  <div className="flex flex-col sm:flex-row gap-4 pt-8 justify-center lg:justify-start items-center lg:items-start >">
                    <Button
                      type="primary"
                      className="w-fit"
                      onClick={() => {
                        setOpenForm(true)
                      }}
                    >
                      <span>
                        {data?.bookBtnContent[0]?.buttonText ||
                          'Book Free Demo'}
                      </span>
                    </Button>
                    <Button type="secondary" className="w-fit">
                      {data?.bookBtnContent[1]?.buttonText || 'See Pricing'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right Content - Video Section */}
              <div className="relative w-full max-w-[537px]">
                <div className="relative w-full lg:h-[550px] rounded-[24px] overflow-hidden aspect-video">
                  {video ? (
                  <VideoPlayers
                    video={video[0]}
                    thumbnail={video[0]?.videoThumbnail}
                  />
                  ):
                  (
                    <ImageLoader
                      image={data?.heroImage}
                      alt={data?.heroImage?.altText}
                      className="w-full h-full object-cover"
                    />
                  )}
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
