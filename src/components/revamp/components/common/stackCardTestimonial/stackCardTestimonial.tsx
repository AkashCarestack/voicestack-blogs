import React, { useContext, useState } from 'react'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Button from '~/components/common/Button'
import SectionHeader from '../sectionHeader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { FormModal } from '~/components/common/FormModal'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import { PortableText } from '@portabletext/react'
import SwitchableTabs from '../switchableTabs'

interface TestimonialData {
  id: string
  name: string
  company: string
  logo: {
    url: string
    alt: string
  }
  profileImage: {
    url: string
    alt: string
  }
  quote: string
  keyFeatures: string[]
  aiSummary: {
    text: string
    highlightedWords: string[]
  }
  videoThumbnail: {
    url: string
    alt: string
  }
}

interface StackCardTestimonialProps {
  refer?: any
  data?: any
}

const StackCardTestimonial: React.FC<StackCardTestimonialProps> = ({
  refer,
  data,
}) => {
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-lg lg:text-2xl md:font-bold font-semibold text-gray-500 !leading-[150%] font-manrope">
          {children}
        </p>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="text-lg lg:text-2xl font-medium text-gray-900 leading-relaxed">
          {children}
        </blockquote>
      ),
    },
    marks: {
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="text-gray-950">{children}</span>
      ),
    },
  }
  const [isOpen, setIsOpen] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const { isDemoPopUpShown, setIsDemoPopUpShown } = useContext(BookDemoContext)

  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const currentTestimonial = data?.tabs[activeTestimonial]
  console.log('currentTestimonial', data)
  return (
    <Section className="relative py-sm md:py-md  bg-[#F9F9F9]">
      <Container className="w-full justify-center">
        <div className="text-center flex flex-col md:gap-16 gap-8 overflow-hidden">
          <SectionHeader heading={data?.headline} />

          {/* Company Logos Tabs */}
          <SwitchableTabs
            data={
              data?.tabs?.map((tab, index) => ({
                ...tab,
                id: tab.id || index.toString(),
              })) || []
            }
            setActiveTab={(e: string) => setActiveTestimonial(Number(e))}
            activeTab={activeTestimonial.toString()}
            className="md:hidden block"
            isShowImage={true}
          />
          <div className="md:grid hidden md:grid-cols-4 gap-6 lg:gap-8 ">
            {data?.tabs?.map((testimonial, index) => (
              <button
                key={testimonial.id}
                onClick={() => setActiveTestimonial(index)}
                className={`flex flex-col items-center w-full group transition-all duration-300 ${
                  activeTestimonial === index
                    ? 'opacity-100 border-b-[3px] border-gray-950'
                    : 'opacity-60 hover:opacity-80 border-b-[2px] border-gray-200'
                }`}
              >
                <div className={`relative md:my-6 my-2`}>
                  <div
                    className="mb-6"
                    style={{
                      height: `48px`,
                      width: `${
                        48 *
                          testimonial?.testimonial?.logo?.metadata?.dimensions
                            ?.aspectRatio || 2
                      }px`,
                    }}
                  >
                    <ImageLoader
                      image={testimonial?.testimonial?.logo?.url}
                      alt={testimonial?.testimonial?.logo?.altText}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* {activeTestimonial === index && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 rounded-full"></div>
                  )} */}
                </div>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-32 justify-between items-center lg:items-start">
            <div className="xl:max-w-[501px] hidden md:block">
              <div
                className="flex relative w-full"
                style={{
                  height: `607px`,
                  width: `${
                    607 *
                      currentTestimonial?.image?.metadata?.dimensions
                        ?.aspectRatio || 2
                  }px`,
                }}
              >
                <ImageLoader
                  image={currentTestimonial?.image?.url}
                  className="w-full h-full object-contain"
                  alt="Company Logo"
                />
              </div>
            </div>

            {/* Right Column - Testimonial Details */}
            <div className="xl:min-w-[606px] w-full flex flex-col md:gap-8 gap-4">
              {/* Quote */}
              {currentTestimonial?.testimonial?.keyStatement && (
                <blockquote className="text-xl lg:text-2xl font-medium text-left min-h-[259px]">
                  <PortableText
                    value={currentTestimonial?.testimonial?.keyStatement}
                    components={components}
                  />
                </blockquote>
              )}

              {/* Key Features */}
              {currentTestimonial?.testimonial?.keyFeatures && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-700 uppercase leading-[200%] tracking-[0.8px]">
                      KEY FEATURES USED
                    </h3>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="93"
                      height="8"
                      viewBox="0 0 93 8"
                      fill="none"
                    >
                      <path
                        d="M92.333 0.333496C92.5098 0.333496 92.6797 0.403784 92.8047 0.528809C92.9297 0.653833 93 0.823678 93 1.00049C92.9999 1.1771 92.9295 1.34626 92.8047 1.47119C92.6797 1.59622 92.5098 1.6665 92.333 1.6665C91.4959 1.66677 90.9756 2.69787 90.2764 4.271C89.569 5.86299 88.766 7.6665 87 7.6665C85.274 7.6665 84.3297 5.96706 83.417 4.32373C82.6911 3.01721 81.9406 1.6665 81 1.6665C80.0588 1.6665 79.3089 3.01721 78.583 4.32373C77.6697 5.96706 76.7253 7.6665 75 7.6665C73.2333 7.6665 72.431 5.86299 71.7236 4.271C71.0251 2.69787 70.5041 1.66677 69.667 1.6665C69.61 1.6665 69.5543 1.65618 69.5 1.64209C69.4457 1.65618 69.39 1.6665 69.333 1.6665C68.4959 1.66677 67.9756 2.69787 67.2764 4.271C66.569 5.86299 65.766 7.6665 64 7.6665C62.274 7.6665 61.3297 5.96706 60.417 4.32373C59.6911 3.01721 58.9406 1.6665 58 1.6665C57.0588 1.6665 56.3089 3.01721 55.583 4.32373C54.6697 5.96706 53.7253 7.6665 52 7.6665C50.2333 7.6665 49.431 5.86299 48.7236 4.271C48.0251 2.69787 47.5041 1.66677 46.667 1.6665C46.61 1.6665 46.5543 1.65618 46.5 1.64209C46.4457 1.65618 46.39 1.6665 46.333 1.6665C45.4959 1.66677 44.9756 2.69787 44.2764 4.271C43.569 5.86299 42.766 7.6665 41 7.6665C39.274 7.6665 38.3297 5.96706 37.417 4.32373C36.6911 3.01721 35.9406 1.6665 35 1.6665C34.0588 1.6665 33.3089 3.01721 32.583 4.32373C31.6697 5.96706 30.7253 7.6665 29 7.6665C27.2333 7.6665 26.431 5.86299 25.7236 4.271C25.0251 2.69787 24.5041 1.66677 23.667 1.6665C23.61 1.6665 23.5543 1.65618 23.5 1.64209C23.4457 1.65618 23.39 1.6665 23.333 1.6665C22.4959 1.66677 21.9756 2.69787 21.2764 4.271C20.569 5.86299 19.766 7.6665 18 7.6665C16.274 7.6665 15.3297 5.96706 14.417 4.32373C13.6911 3.01721 12.9406 1.6665 12 1.6665C11.0588 1.6665 10.3089 3.01721 9.58301 4.32373C8.66967 5.96706 7.72533 7.6665 6 7.6665C4.23334 7.6665 3.43097 5.86299 2.72363 4.271C2.02506 2.69787 1.50414 1.66677 0.666992 1.6665C0.490181 1.6665 0.320337 1.59622 0.195312 1.47119C0.0704664 1.34626 8.73862e-05 1.1771 0 1.00049C0 0.823678 0.0702897 0.653833 0.195312 0.528809C0.320337 0.403784 0.490181 0.333496 0.666992 0.333496C2.43324 0.333718 3.23515 2.13723 3.94238 3.729C4.64105 5.30167 5.16267 6.3335 6 6.3335C6.94128 6.3335 7.69103 4.98286 8.41699 3.67627C9.33033 2.03294 10.2747 0.333496 12 0.333496C13.726 0.333496 14.6703 2.03294 15.583 3.67627C16.309 4.98286 17.0594 6.3335 18 6.3335C18.8373 6.3335 19.3583 5.30167 20.0576 3.729C20.7649 2.13723 21.5674 0.333718 23.333 0.333496C23.3899 0.333496 23.4458 0.342898 23.5 0.356934C23.5542 0.342898 23.6101 0.333496 23.667 0.333496C25.4332 0.333718 26.2351 2.13723 26.9424 3.729C27.6411 5.30167 28.1627 6.3335 29 6.3335C29.9413 6.3335 30.691 4.98286 31.417 3.67627C32.3303 2.03294 33.2747 0.333496 35 0.333496C36.726 0.333496 37.6703 2.03294 38.583 3.67627C39.309 4.98286 40.0594 6.3335 41 6.3335C41.8373 6.3335 42.3583 5.30167 43.0576 3.729C43.7649 2.13723 44.5674 0.333718 46.333 0.333496C46.3899 0.333496 46.4458 0.342898 46.5 0.356934C46.5542 0.342898 46.6101 0.333496 46.667 0.333496C48.4332 0.333718 49.2351 2.13723 49.9424 3.729C50.641 5.30167 51.1627 6.3335 52 6.3335C52.9413 6.3335 53.691 4.98286 54.417 3.67627C55.3303 2.03294 56.2747 0.333496 58 0.333496C59.726 0.333496 60.6703 2.03294 61.583 3.67627C62.309 4.98286 63.0594 6.3335 64 6.3335C64.8373 6.3335 65.3583 5.30167 66.0576 3.729C66.7649 2.13723 67.5674 0.333718 69.333 0.333496C69.3899 0.333496 69.4458 0.342898 69.5 0.356934C69.5542 0.342898 69.6101 0.333496 69.667 0.333496C71.4332 0.333718 72.2351 2.13723 72.9424 3.729C73.6411 5.30167 74.1627 6.3335 75 6.3335C75.9413 6.3335 76.691 4.98286 77.417 3.67627C78.3303 2.03294 79.2747 0.333496 81 0.333496C82.726 0.333496 83.6703 2.03294 84.583 3.67627C85.309 4.98286 86.0594 6.3335 87 6.3335C87.8373 6.3335 88.3583 5.30167 89.0576 3.729C89.7649 2.13723 90.5674 0.333718 92.333 0.333496Z"
                        fill="url(#paint0_linear_2142_33622)"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_2142_33622"
                          x1="-0.5"
                          y1="4.7998"
                          x2="93"
                          y2="3.66667"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stop-color="#4A3CE1" />
                          <stop offset="1" stop-color="#FF708C" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {currentTestimonial?.testimonial?.keyFeatures?.map(
                      (feature, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 border border-gray-200 text-gray-950 px-4 py-1.5 rounded-[500px] text-sm font-normal"
                        >
                          {feature}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Profile */}
              <div className="flex items-center gap-3 border-b border-gray-200 pb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <ImageLoader
                    image={
                      currentTestimonial?.testimonial?.testimonialImage?.url
                    }
                    alt={currentTestimonial?.testimonial?.testimonialImage?.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1 items-start">
                  <p className="font-semibold text-gray-900">
                    {currentTestimonial?.testimonial?.name}
                  </p>
                  <p className="text-gray-600">
                    {currentTestimonial?.testimonial?.designation}
                  </p>
                </div>
              </div>

              {currentTestimonial?.ctaListItems && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center lg:items-start >">
                  <Button
                    type="primary"
                    className="w-fit"
                    onClick={() => {
                      setOpenForm(true)
                    }}
                  >
                    <span>
                      {currentTestimonial?.ctaListItems[0]?.ctaText ||
                        'Book Free Demo'}
                    </span>
                  </Button>
                  <Button type="secondary" className="w-fit">
                    {currentTestimonial.ctaListItems[1]?.ctaText ||
                      'See Pricing'}
                  </Button>
                </div>
              )}
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
    </Section>
  )
}

export default StackCardTestimonial
