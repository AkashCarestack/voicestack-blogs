import Container from '~/components/structure/Container'
import SectionHeader from '../sectionHeader'
import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Section from '~/components/structure/Section'
import { PortableText } from '@portabletext/react'

interface PartnerPageTestimonialProps {
  data: any
}

export default function PartnerPageTestimonial({
  data,
}: PartnerPageTestimonialProps) {
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-lg lg:text-xl font-bold text-gray-950 !leading-[150%] font-manrope">
          &ldquo;{children}&rdquo;
        </p>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="text-lg lg:text-xl font-bold text-gray-950 !leading-[150%] font-manrope">
          &ldquo;{children}&rdquo;
        </blockquote>
      ),
    },
  }

  const testimonials =
    data.items && data.items.length > 0 ? data.items : null

    console.log(data, "testimonials");

  return (
    <Section className="relative py-sm md:py-md bg-[#F9F9F9] font-geist">
      <Container className="w-full justify-center">
        <div className="">
          <SectionHeader heading={data?.heading} />

          {testimonials && (
            <div className="pt-16 md:pt-16">
              <div
                className="columns-1 md:columns-2 lg:columns-3"
                style={{ columnGap: '1.5rem' }}
              >
                {testimonials.map((testimonial: any, index: number) => (
                  <div
                    key={index}
                    className="bg-[#F4F3FA] rounded-[12px] md:rounded-[24px] p-3 break-inside-avoid mb-6"
                  >
                    <div className="relative flex flex-col gap-3">
                      {/* Bottom Section - Rating and Content */}
                      <div className="p-3 md:p-6 flex flex-col gap-3">
                        {/* <h3 className="font-bold text-base md:text-xl leading-tight font-manrope">
                          <blockquote className="text-xl lg:text-2xl font-medium text-left">
                            {testimonial?.description}
                          </blockquote>
                        </h3> */}

                        <div className="text-gray-700 text-sm md:text-base leading-[150%]">
                          {testimonial?.description}
                        </div>
                        <div className="flex items-center gap-6 pt-3">
                          {testimonial?.secondaryTestimonialImage?.url ? (
                            <div
                              className="rounded-[8px] overflow-hidden bg-img-gray flex-shrink-0"
                              style={{
                                height: `56px`,
                                width: `56px`,
                              }}
                            >
                              <ImageLoader
                                image={
                                  testimonial?.secondaryTestimonialImage?.url
                                }
                                alt={
                                  testimonial?.secondaryTestimonialImage?.alt
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="rounded-full overflow-hidden bg-img-gray w-12 h-12 flex items-center justify-center">
                              <span className="text-2xl font-bold text-[#4a3ce1]">
                                {testimonial?.heading?.charAt(0)?.toUpperCase()}
                              </span>
                            </div>
                          )}

                          <div className="flex flex-col items-start">
                            <p className="font-semibold text-base md:text-lg leading-[150%] text-gray-950">
                              {testimonial?.heading}
                            </p>
                            <p className="text-sm md:text-base text-gray-600">
                              {testimonial?.subheading}
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

          {/* {data?.bookBtnContent && (
            <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center lg:justify-start items-center lg:items-start">
              {data?.bookBtnContent[0]?.buttonText && (
                <Button type="primary" className="w-fit" link="/demo">
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
          <div className="w-full flex justify-center md:mt-16 mt-10">
            <Button type="primary" className="w-fit" link="/demo">
              <span>Book Free Demo</span>
            </Button>
          </div> */}
        </div>
      </Container>
    </Section>
  )
}

