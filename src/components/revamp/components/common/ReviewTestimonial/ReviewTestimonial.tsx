import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Container from '~/components/structure/Container'
import SectionHeader from '../sectionHeader'
import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Image from 'next/image'
import { VideoModal } from '~/components/common/VideoModal'
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
  const router = useRouter()
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
              <div className="columns-1 md:columns-2 lg:columns-3" style={{ columnGap: '1.5rem' }}>
                {testimonials.map((testimonial: any, index: number) => (
                  <div
                    key={index}
                    className={`bg-[#F4F3FA] rounded-[12px] md:rounded-[24px] p-3 break-inside-avoid mb-6 ${
                      testimonial?.video?.[0]?.videoId ? 'relative' : ''
                    }`}
                  >
                    <div className="relative flex flex-col gap-3">
                      {testimonial?.video?.[0]?.videoId ? (
                        <div className="relative rounded-[12px] overflow-hidden aspect-video">
                          <Image
                            src={`https://img.youtube.com/vi/${testimonial.video[0].videoId}/maxresdefault.jpg`}
                            alt={`Video thumbnail for ${testimonial?.name || 'testimonial'}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <button
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors cursor-pointer group"
                            onClick={() => openCurrentModal(index)}
                            aria-label="Play video"
                          >
                            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                              <svg
                                width="24"
                                height="28"
                                viewBox="0 0 24 28"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="translate-x-[1px]"
                              >
                                <path
                                  d="M22.6842 12.4201C23.2732 12.7368 23.2732 13.5411 22.6842 13.8578L2.36842 26.1011C1.77937 26.4178 1 25.9855 1 25.2433L1 1.03455C1 0.292349 1.77937 -0.13995 2.36842 0.176745L22.6842 12.4201Z"
                                  fill="#4A3CE1"
                                />
                              </svg>
                            </div>
                          </button>
                        </div>
                      ) : (
                        ''
                      )}

                      {/* </div> */}

                      {/* Bottom Section - Rating and Content */}

                      <div className="p-3 md:p-6 flex flex-col gap-3">
                        <h3 className="font-bold text-base md:text-xl leading-tight font-manrope">
                          <blockquote className="text-xl lg:text-2xl font-medium text-left ">
                            <PortableText
                              value={testimonial.mainStatement}
                              components={components}
                            />
                          </blockquote>
                        </h3>

                        {openModal === index &&
                          isOpen &&
                          testimonial.video[0]?.videoId && (
                            <VideoModal
                              videoDetails={{
                                videoId: testimonial?.video[0]?.videoId,
                                videoPlatform: 'youtube',
                              }}
                              isPopup={true}
                              className={`pt-9 z-30 flex items-start`}
                              onClose={() => setIsOpen(false)}
                              openForm={() => router.push('/demo')}
                              hasDemoBanner={true}
                            />
                          )}

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
                  link="/demo"
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
      </Container>
    </Section>
  )
}
