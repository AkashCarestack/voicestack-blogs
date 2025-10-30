import { useContext, useEffect, useState } from 'react'
import Container from '~/components/structure/Container'
import SectionHeader from '../sectionHeader'
import Button from '~/components/common/Button'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Image from 'next/image'
import { VideoModal } from '~/components/common/VideoModal'
import { FormModal } from '~/components/common/FormModal'
import Section from '~/components/structure/Section'
import { PortableText } from '@portabletext/react'

interface ReviewTestimonialProps {
  data: any
}

export default function ReviewTestimonial({ data }: ReviewTestimonialProps) {
  console.log(data, 'data in review testimonial')
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-lg lg:text-xl font-bold text-gray-950 !leading-[150%] font-manrope">
          {children}
        </p>
      ),
    },
  }
  const [isOpen, setIsOpen] = useState(false)
  const [openModal, setOpenModal] = useState<number>()
  const [openForm, setOpenForm] = useState(false)
  const { isDemoPopUpShown } = useContext(BookDemoContext)
  function openCurrentModal(index: number) {
    setIsOpen(() => true)
    setOpenModal(() => index)
  }

  const testimonials =
    data.testimonial && data.testimonial.length > 0 ? data.testimonial : null
  const [background, setBackground] = useState<any>()

  useEffect(() => {
    setBackground(data.background)
  }, [data])

  // Generate JSON-LD for videos
  //   const newTestimonialList = testimonials ? testimonials.reduce(
  //     (acc: any, testimonial: any) => {
  //       if (testimonial.video[0]?.videoId) {
  //         return [...acc, videoJsonLd(testimonial.content)];
  //       }
  //       return acc;
  //     },
  //     []
  //   ) : [];

  // console.log(testimonials, "testimonials");

  return (
    <Section className="relative py-sm md:py-md  bg-[#F9F9F9]">
      <Container className="w-full justify-center">
        <div className="font-sans">
          <SectionHeader heading={data?.heading} />

          {testimonials && (
            <div className="pt-16 md:pt-16">
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
                {testimonials.map((testimonial: any, index: number) => (
                  <div
                    key={index}
                    className={`bg-[#F4F3FA] rounded-[12px] md:rounded-[24px] p-3 break-inside-avoid ${
                      testimonial.video[0]?.videoId ? 'relative' : ''
                    }`}
                  >
                    <div className="relative flex flex-col gap-3">
                      <div className="relative min-h-[210px] rounded-[12px] overflow-hidden aspect-video">
                        {/* Top Section - Author Info and Video Button */}
                        {/* <div
                        className={`flex justify-between ${testimonial.video[0]?.videoId ? 'gap-3 items-center absolute bottom-0 p-4 left-0 w-full z-[3] bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,#000_100%)]' : 'mb-4  items-center'}`}
                      > */}
                        {/* <div className={`flex items-center gap-3`}>
                          <div
                            className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 ${testimonial.video[0]?.videoId ? 'hidden' : ''}`}
                          >
                            {testimonial.testimonialImage?.[0]?.image && (
                              <ImageLoader
                                image={testimonial.testimonialImage[0].image}
                                className="w-full h-full object-cover block"
                              />
                            )}
                          </div>
                         
                        </div> */}

                        {/* {testimonial.video[0]?.videoId && (
                          <button
                            className="w-10 h-10 bg-white/40 rounded-full border-none flex items-center justify-center flex-shrink-0 cursor-pointer"
                            onClick={() => openCurrentModal(index)}
                            title="Play"
                          >
                            <svg
                              width="29"
                              height="34"
                              viewBox="0 0 29 34"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-[17px] translate-x-[2px]"
                            >
                              <path
                                d="M27.4576 15.5325C28.5875 16.1849 28.5875 17.8159 27.4576 18.4683L2.54184 32.8534C1.41187 33.5058 -0.000585209 32.6903 -0.000585152 31.3855L-0.000583894 2.61528C-0.000583837 1.31051 1.41187 0.495026 2.54184 1.14741L27.4576 15.5325Z"
                                fill="#fff"
                              />
                            </svg>
                          </button>
                        )} */}
                        <video
                          key={testimonial?.thumbnail}
                          style={{
                            backgroundColor: 'transparent',
                            backgroundImage: 'none',
                            backgroundSize: 0,
                            backgroundPosition: 0,
                            backgroundRepeat: 'no-repeat',
                            objectFit: 'cover',
                          }}
                          className="absolute h-full w-full object-cover aspect-video"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source
                            src={testimonial?.thumbnail}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>

                      {/* </div> */}

                      {/* Bottom Section - Rating and Content */}

                      <div className="p-6 flex flex-col gap-3">
                        <h3 className="font-bold text-base md:text-xl leading-tight font-manrope">
                          <blockquote className="text-xl lg:text-2xl font-medium text-left ">
                            <PortableText
                              value={testimonial.mainStatement}
                              components={components}
                            />
                          </blockquote>
                        </h3>

                        {/* {openModal === index && isOpen && testimonial.video[0]?.videoId && (
                          <VideoModal   
                            videoDetails={{
                              videoId: testimonial.content.videoId,
                              videoPlatform: 'youtube',
                            }}
                            isPopup={true}
                            className={`pt-9 z-30 flex items-start`}
                            onClose={() => setIsOpen(false)}
                            openForm={() => setOpenForm(true)}
                            hasDemoBanner={true}
                          />
                        )} */}

                        <div className="text-gray-700 text-sm md:text-base leading-[150%]">
                          <PortableText
                            value={testimonial.subStatement}
                            // components={components}
                          />
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <ImageLoader
                              image={testimonial?.testimonialImage?.url}
                              alt={testimonial?.testimonialImage?.alt}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex flex-col gap-1 items-start">
                            <p className="font-semibold text-base md:text-lg leading-[150%] text-gray-950">
                              {testimonial?.name}
                            </p>
                            <p className="text-sm md:text-base text-gray-600">
                              {testimonial?.designation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data?.bookBtnContent && (
            <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center lg:justify-start items-center lg:items-start >">
              {data?.bookBtnContent[0]?.buttonText && (
                <Button
                  type="primary"
                  className="w-fit"
                  onClick={() => {
                    setOpenForm(true)
                  }}
                >
                  <span>
                    {data?.bookBtnContent[0]?.buttonText || 'Book Free Demo'}
                  </span>
                </Button>
              )}
              {data?.bookBtnContent[1]?.buttonText && (
                <Button type="secondary" className="w-fit">
                  {data?.bookBtnContent[1]?.buttonText || 'See Pricing'}
                </Button>
              )}
            </div>
          )}
        </div>
        {openForm && (
          <FormModal
            className={`pt-9  flex items-start`}
            onClose={() => setOpenForm(false)}
            data={isDemoPopUpShown}
          />
        )}
      </Container>
    </Section>
  )
}
