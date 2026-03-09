import { PortableText } from '@portabletext/react'
import React, { useRef, useState } from 'react'

import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import SectionHeaderV2 from '../components/common/sectionHeaderV2'
import { useRouter } from 'next/router'

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
  page?: string
  refer?: any
  data?: any
  isPricingPage?: boolean
}

const StackCardTestimonial: React.FC<StackCardTestimonialProps> = ({
  page,
  refer,
  data,
  isPricingPage = false,
}) => {


  const router = useRouter();
  const isUs = router.locale === 'en';
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-base lg:text-2xl md:font-bold font-semibold text-gray-500 !leading-[150%] font-manrope">
          &ldquo;{children}&rdquo;
        </p>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="text-base lg:text-2xl font-medium text-gray-900 leading-relaxed">
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
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Early return if data is missing or invalid
  if (
    !data ||
    !data?.tabs ||
    !Array.isArray(data.tabs) ||
    data.tabs.length === 0
  ) {
    return null
  }

  // Ensure activeTestimonial is within valid bounds
  const validActiveIndex = Math.max(
    0,
    Math.min(activeTestimonial, data.tabs.length - 1),
  )
  const currentTestimonial = data.tabs[validActiveIndex]

  const sectionCta = data?.ctaListItems;
  const ctaItems =
    currentTestimonial?.ctaListItems ||
    (sectionCta?.length ? sectionCta : null);

  // Early return if currentTestimonial is missing
  if (!currentTestimonial) {
    return null
  }


  return (
    <Section className="relative bg-[#FFFFFF]"  >
      <Container
        className="w-full justify-center pt-sm md:pt-md lg:pt-lg pb-sm md:pb-md"
        type="V2"
        border="y-0"
      >
        <div className="text-center flex flex-col md:gap-16 gap-8 overflow-hidden">
          <SectionHeaderV2
            className="xl:px-12 md:px-6 px-4"
            heading={data?.headline}
            description={data?.subDescription}
          />
          <div>
            {/* Logo Tabs - Only for case-studies */}
            {page === 'case-studies' && (
              <>
                {/* Logo Tabs - Desktop */}
                <div className="flex gap-6 lg:gap-8 overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none justify-center">
                  {data?.tabs?.map((testimonial, index) => (
                    <button
                      ref={(el) => {
                        if (tabRefs.current) {
                          tabRefs.current[index] = el
                        }
                      }}
                      key={testimonial.id}
                      onClick={() => {
                        setActiveTestimonial(index)
                        const targetElement = tabRefs.current[index]
                        if (targetElement) {
                          targetElement.scrollIntoView({
                            behavior: 'smooth',
                            inline: 'center',
                            block: 'nearest',
                          })
                        }
                      }}
                      className={`flex flex-1 flex-col items-center flex-shrink-0 group transition-opacity duration-300 relative border-b-[3px] ${activeTestimonial === index
                          ? 'opacity-100 border-gray-950'
                          : 'opacity-60 hover:opacity-80 border-transparent'
                        }`}
                    >
                      <div className="relative md:my-6 my-2">
                        <div
                          className="mb-6"
                          style={{
                            height: `48px`,
                            width: `${48 *
                              (testimonial?.testimonial?.secondaryLogo?.metadata
                                ?.dimensions?.aspectRatio || 2)
                              }px`,
                          }}
                        >
                          <ImageLoader
                            image={testimonial?.testimonial?.secondaryLogo?.url}
                            alt={
                              testimonial?.testimonial?.secondaryLogo?.altText
                            }
                            title={
                              currentTestimonial?.testimonial?.practiceName
                                ? testimonial?.testimonial?.practiceName
                                : testimonial?.testimonial?.secondaryLogo
                                  ?.altText
                            }
                            className="w-full h-full object-contain invert-[100%]"
                          />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Regular Tabs - Only for non-case-studies */}
            {page !== 'case-studies' && data?.tabs?.length > 1 && (
              <div className={`flex overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none border-y border-gray-200`}>
                {data?.tabs?.map((testimonial, index) => (
                  <button
                    ref={(el) => {
                      if (tabRefs.current) {
                        tabRefs.current[index] = el
                      }
                    }}
                    key={testimonial.id}
                    onClick={() => {
                      setActiveTestimonial(index)
                      // Scroll the clicked tab into view to show there are more tabs available
                      const targetElement = tabRefs.current[index]
                      if (targetElement) {
                        targetElement.scrollIntoView({
                          behavior: 'smooth',
                          inline: 'center',
                          block: 'nearest',
                        })
                      }
                    }}
                    className={`flex w-full flex-col items-center  flex-1 group transition-all duration-300 border-r-[2px] last:border-r-0 border-b-[3px] ${activeTestimonial === index
                        ? 'grayscale-100 border-b-gray-950 border-r-gray-50 bg-gray-50'
                        : 'grayscale hover:grayscale-0 border-r-gray-200 border-transparent'
                      }`}
                  >
                    <div className={`relative md:my-6 my-2`}>
                      <div
                        className="hidden md:block"
                        style={{
                          height: `48px`,
                          width: `${48 *
                            testimonial?.testimonial?.logo?.metadata
                              ?.dimensions?.aspectRatio || 2
                            }px`,
                        }}
                      >
                        <ImageLoader
                          image={testimonial?.testimonial?.logo?.url}
                          alt={testimonial?.testimonial?.logo?.altText}
                          title={
                            currentTestimonial?.testimonial?.practiceName
                              ? testimonial?.testimonial?.practiceName
                              : testimonial?.testimonial?.logo?.altText
                          }
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="block md:hidden px-4">
                        <div
                          style={{
                            height: `32px`,
                            width: `${32 *
                              testimonial?.testimonial?.logo?.metadata
                                ?.dimensions?.aspectRatio || 2
                              }px`,
                          }}
                        >
                          <ImageLoader
                            image={testimonial?.testimonial?.logo?.url}
                            alt={testimonial?.testimonial?.logo?.altText}
                            title={
                              currentTestimonial?.testimonial?.practiceName
                                ? testimonial?.testimonial?.practiceName
                                : testimonial?.testimonial?.logo?.altText
                            }
                            className="w-full h-full object-contain "
                          />
                        </div>
                      </div>
                      {/* {activeTestimonial === index && (
                    <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gray-800 rounded-full"></div>
                  )} */}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Main Content */}
            {page === 'case-studies' ? (
              <>
                {/* Main Card - Two Column Layout */}
                <div
                  className="flex flex-col md:min-h-[555px] h-full  lg:flex-row w-full gap-6 lg:gap-8 rounded-[12px] md:rounded-[24px] p-3"
                  style={{
                    background:
                      'linear-gradient(288deg, #7467FF 0.48%, #4A3CE1 98.9%), #030712',
                  }}
                >
                  {/* Left Panel - White Background with Logo and Statistics */}
                  <div className="w-full lg:w-[320px] flex-shrink-0 bg-white rounded-[6px] md:rounded-[12px] p-6 md:p-8 text-left">
                    {/* Company Logo */}
                    {currentTestimonial?.testimonial?.secondaryLogo && (
                      <div
                        className="mb-8"
                        style={{
                          height: `48px`,
                          width: `${48 *
                            (currentTestimonial?.testimonial?.secondaryLogo
                              ?.metadata?.dimensions?.aspectRatio || 2)
                            }px`,
                        }}
                      >
                        <ImageLoader
                          image={
                            currentTestimonial?.testimonial?.secondaryLogo?.url
                          }
                          alt={
                            currentTestimonial?.testimonial?.secondaryLogo
                              ?.altText || 'Company Logo'
                          }
                          className="w-full h-full object-contain invert-[100%]"
                        />
                      </div>
                    )}
                    {(() => {
                      const filteredListItems =
                        currentTestimonial?.testimonial?.listItems?.filter(
                          (item: any) =>
                            item?.isHighlighted !== true &&
                            item?.isHighlighted !== 'true',
                        ) || []

                      if (filteredListItems.length > 0) {
                        return (
                          <div className="flex flex-col gap-0">
                            {filteredListItems.map(
                              (metric: any, index: number) => {
                                const hasAfter =
                                  metric?.after &&
                                  (typeof metric.after === 'string'
                                    ? metric.after.trim() !== ''
                                    : true)

                                return (
                                  <div
                                    key={metric._key || index}
                                    className="py-4 border-b border-gray-200 last:border-b-0"
                                  >
                                    {hasAfter && (
                                      <>
                                        <div
                                          className="text-2xl md:text-3xl font-semibold text-gray-950 font-manrope mb-1"
                                          dangerouslySetInnerHTML={{
                                            __html: metric?.after || '',
                                          }}
                                        />
                                        <div className="text-sm md:text-base text-gray-600">
                                          {metric?.listHeading ||
                                            metric.heading ||
                                            ''}
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )
                              },
                            )}
                          </div>
                        )
                      }
                      return null
                    })()}
                  </div>

                  {/* Right Panel - Purple Background with Content */}
                  <div className="flex-1 rounded-[12px] md:rounded-[24px] p-6 md:p-8 lg:p-12 flex flex-col justify-between min-h-[500px] text-left">
                    <div className="flex flex-col gap-6">
                      {/* Description - testimonialdescription is a text field, not blockContent */}
                      {currentTestimonial?.testimonial
                        ?.keyNoteStatement && (
                          <div className="text-base md:text-lg text-white leading-relaxed">
                            <p className="text-base md:text-lg text-white leading-relaxed">
                              <PortableText value={currentTestimonial?.testimonial?.keyNoteStatement} components={{
                                block: {
                                  normal: ({ children }: any) => (
                                    <p className="text-base md:text-lg text-white leading-relaxed">
                                      {children}
                                    </p>
                                  ),
                                  blockquote: ({ children }: any) => (
                                    <blockquote className="text-base md:text-lg text-white leading-relaxed">
                                      &ldquo;{children}&rdquo;
                                    </blockquote>
                                  ),
                                },
                              }} />
                            </p>
                          </div>
                        )}

                      {/* Key Features - Pill Tags */}
                      {currentTestimonial?.testimonial?.keyFeatures &&
                        currentTestimonial.testimonial.keyFeatures.length >
                        0 && (
                          <div className="flex flex-wrap gap-3 mt-2">
                            {currentTestimonial.testimonial.keyFeatures.map(
                              (feature: string, index: number) => (
                                <span
                                  key={index}
                                  className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white text-sm md:text-base font-normal rounded-full border border-white/20"
                                >
                                  {feature}
                                </span>
                              ),
                            )}
                          </div>
                        )}
                    </div>

                    {/* Bottom Section - Author Info and CTA */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8 pt-6 border-t border-white/20">
                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        {currentTestimonial?.testimonial?.testimonialImage && (
                          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                            <ImageLoader
                              image={
                                currentTestimonial.testimonial.testimonialImage
                              }
                              alt={
                                currentTestimonial?.testimonial?.name ||
                                'Author'
                              }
                              className="w-full h-full object-cover bg-[#ababab]"
                            />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <p className="font-semibold text-white text-base">
                            {currentTestimonial?.testimonial?.name}
                          </p>
                          <p className="text-white/60 text-sm">
                            {currentTestimonial?.testimonial?.designation}
                          </p>
                        </div>
                      </div>

                      {/* CTA Button */}
                      {currentTestimonial?.ctaListItems?.[0] ? (
                        <Button
                          type="primary"
                          link={
                            currentTestimonial?.ctaListItems?.[0]?.ctaLink ||
                            '/demo'
                          }
                          className="w-fit"
                        >
                          <span className="text-base font-medium">
                            {'Book Free Demo'}
                          </span>
                        </Button>
                      ) : (
                        <Button type="primary" link="/demo" className="w-fit">
                          <span className="text-base font-medium">
                            Book Free Demo
                          </span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className={`flex flex-col lg:flex-row items-center lg:items-stretch ${data.tabs.length > 1 ? 'border-b ' : 'border-y'} border-gray-200`}>
                <div className="xl:w-1/2 xl:max-w-[666px] w-full hidden lg:flex items-center justify-center border-r border-gray-200">
                  <div
                    className="flex items-center justify-center relative w-full h-full"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        -45deg,
                        #E5E7EB,
                        #E5E7EB 1px,
                        transparent 1px,
                        transparent 10px
                      )`,
                      // backgroundSize: 'cover',
                      // backgroundPosition: 'center',
                      // backgroundRepeat: 'no-repeat',
                      width: '100%',
                      height: '100%',
                      backgroundSize: '14.14px 14.14px',
                      padding: '48px',
                    }}
                  >
                    <div
                      className="flex relative min-h-[548px] max-w-[570px] w-full h-full"
                      style={{
                        // height: `548px`,
                        // width: `${
                        //   548 *
                        //     (currentTestimonial?.image?.metadata?.dimensions
                        //       ?.aspectRatio || 2)
                        // }px`,
                      }}
                    >
                      <ImageLoader
                        image={currentTestimonial?.image?.url}
                        alt={
                          currentTestimonial?.image?.alt ||
                          currentTestimonial?.tabHeading
                        }
                        title={
                          currentTestimonial?.testimonial?.practiceName
                            ? currentTestimonial?.testimonial?.practiceName
                            : currentTestimonial?.image?.title
                        }
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Right Column - Testimonial Details */}
                <div className="xl:w-1/2 w-full flex flex-col justify-between">
                  <div className="p-6 md:py-12 md:px-16 justify-between flex flex-col h-full gap-6">
                    {/* Quote */}
                    {currentTestimonial?.testimonial?.keyNoteStatement && (
                      <blockquote className="text-lg lg:text-2xl font-medium text-left md:min-h-[259px]">
                        <PortableText
                          value={currentTestimonial?.testimonial?.keyNoteStatement}
                          components={components}
                        />
                      </blockquote>
                    )}
                    {/* Profile */}
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-[6px] overflow-hidden bg-img-gray flex-shrink-0">
                        <ImageLoader
                          image={
                            currentTestimonial?.testimonial
                              ?.secondaryTestimonialImage?.url
                          }
                          alt={
                            currentTestimonial?.testimonial
                              ?.secondaryTestimonialImage?.alt
                          }
                          className="w-full h-full object-cover bg-[#ababab]"
                        />
                      </div>
                      <div className="flex flex-col gap-1 items-start">
                        <p className="font-semibold text-gray-900">
                          {currentTestimonial?.testimonial?.name}
                        </p>
                        <p className="text-gray-600 text-left">
                          {currentTestimonial?.testimonial?.designation}
                        </p>
                      </div>
                    </div>
                    {/* Key Features */}
                    {currentTestimonial?.testimonial?.keyFeatures && (
                      <div className="space-y-3 pb-6 ">
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
                  </div>



                  {/* Button Section - Bottom with Border Top */}
                  {ctaItems ? (
                    <div className="flex flex-col sm:flex-row gap-4  border-t border-gray-200 px-6 py-6 md:px-16 md:pt-8 md:pb-12  mt-auto">
                      <Button type="primary" className="w-fit" link="/demo">
                        <span>
                          {isPricingPage
                            ? 'Book Free Demo'
                            : ctaItems[0]?.ctaText || 'Book Free Demo'}
                        </span>
                      </Button>
                      {!isPricingPage && isUs && (
                        <Button
                          type="secondary"
                          className="w-fit"
                          link={ctaItems[1]?.ctaLink || '/pricing'}
                        >
                          {ctaItems[1]?.ctaText || 'See Pricing'}
                        </Button>
                      )}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default StackCardTestimonial
