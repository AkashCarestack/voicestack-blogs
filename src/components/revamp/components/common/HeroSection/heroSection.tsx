import { PortableText } from '@portabletext/react'
import { useRouter } from 'next/router'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import SuperChargeIcon from '~/components/icons/superCharge'
import { toCamelCase } from '~/utils/common'

import Button from '../../../../common/Button'
import Container from '../../../../structure/Container'
import { formatPhoneNumberWithCountryCode } from '~/components/utils/helper'
import HeroRightSection from './heroRightSection'

const HeroSection = ({
  data,
  refer = null,
  page = '',
  isCentered = false,
  showFullDescription = true,
  contactData = null,
}: {
  data?: any
  refer?: any
  page?: string
  isCentered?: boolean
  showFullDescription?: boolean
  contactData?: any
}) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
 
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <span className="[&_br]:hidden md:[&_br]:block">{children}</span>
      ),
    },
    marks: {
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="text-vs-purple">{children}</span>
      ),
    },
  }
  // Check if description needs "see more" functionality
  const [needsSeeMore, setNeedsSeeMore] = useState(false)

  useEffect(() => {
    // Use setTimeout to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      if (
        descriptionRef.current &&
        !showFullDescription &&
        data?.heroDescription
      ) {
        const element = descriptionRef.current
        const paragraphs = element.querySelectorAll('p')

        if (paragraphs.length > 0) {
          // Check all paragraphs to see if any are truncated
          let hasTruncatedContent = false

          paragraphs.forEach((paragraph) => {
            // Create a clone without line-clamp to measure full height
            const clone = paragraph.cloneNode(true) as HTMLElement
            clone.style.position = 'absolute'
            clone.style.visibility = 'hidden'
            clone.style.height = 'auto'
            clone.style.maxHeight = 'none'
            clone.classList.remove('line-clamp-2')
            document.body.appendChild(clone)

            const fullHeight = clone.offsetHeight
            const clampedHeight = paragraph.offsetHeight
            const lineHeight = 28
            const maxHeight = lineHeight * 2

            // Check if content exceeds 2 lines
            if (fullHeight > maxHeight || fullHeight > clampedHeight) {
              hasTruncatedContent = true
            }

            document.body.removeChild(clone)
          })

          setNeedsSeeMore(hasTruncatedContent)
        }
      } else {
        setNeedsSeeMore(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [showFullDescription, data?.heroDescription, isDescriptionExpanded])

  const descriptionComponents: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p
          className={`${showFullDescription || isDescriptionExpanded ? '' : 'line-clamp-2 self-stretch'} text-lg text-gray-950 leading-[28px] mb-3 font-normal `}
        >
          {children}
        </p>
      ),
    },
    list: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <ul className="text-base text-gray-950 leading-[24px] self-stretch pt-3 pl-2 md:pl-0 list-inside font-normal text-left">
          {children}
        </ul>
      ),
    },
    listItem: {
      bullet: ({ children }: { children: React.ReactNode }) => (
        <li
          className="flex justify-start gap-3 py-[10px] md:py-[14px] text-base text-gray-950 leading-[24px] border-b"
          style={{ borderColor: '#0307121A' }}
        >
          <span className="mt-[6px] md:mt-2 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="10"
              viewBox="0 0 12 10"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M11.3633 0.322475C11.4261 0.370177 11.4789 0.429802 11.5187 0.497937C11.5584 0.566072 11.5844 0.641379 11.595 0.71955C11.6056 0.797721 11.6007 0.87722 11.5806 0.953497C11.5605 1.02977 11.5255 1.10133 11.4777 1.16408L5.07767 9.56407C5.02576 9.63212 4.95989 9.68827 4.88449 9.72875C4.80908 9.76924 4.72589 9.79312 4.6405 9.79881C4.5551 9.80449 4.46948 9.79184 4.38937 9.7617C4.30927 9.73156 4.23654 9.68464 4.17607 9.62407L0.576072 6.02408C0.470089 5.91034 0.41239 5.7599 0.415133 5.60446C0.417875 5.44902 0.480845 5.30071 0.590775 5.19078C0.700705 5.08085 0.849014 5.01788 1.00445 5.01513C1.1599 5.01239 1.31033 5.07009 1.42407 5.17608L4.53927 8.29047L10.5233 0.436876C10.6196 0.310437 10.7621 0.227378 10.9196 0.20593C11.0771 0.184482 11.2367 0.226397 11.3633 0.322475Z"
                fill="#030712"
              />
            </svg>
          </span>
          <span>{children}</span>
        </li>
      ),
    },
    marks: {
      link: ({
        children,
        value,
      }: {
        children: React.ReactNode
        value?: any
      }) => {
        const href = value?.href || '#'
        const isExternal = href?.startsWith('http') || href?.startsWith('//')
        return (
          <a
            href={href}
            target={'_self'}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className="text-vs-blue font-medium   hover:text-vs-purple transition-colors duration-200"
          >
            {children}
          </a>
        )
      },
    },
  }

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.async = true
    script.src =
      'https://static.hsappstatic.net/MeetingsEmbed/ex/MeetingsEmbedCode.js'
    document.body.appendChild(script)
  }, [])

  if (!data) {
    return null
  }

  return (
    <section className="font-geist justify-center">
      <Container
        className={`${isCentered ? ' ' : 'py-4 lg:py-0'} justify-center`}
      >
        {isCentered ? (
          <div
            className={`${showFullDescription ? 'max-w-[808px]' : 'max-w-[606px]'} flex flex-col items-center text-center  gap-3 py-12  lg:pt-md lg:pb-md`}
          >
            {data?.heroStrip && data?.heroheading ? (
              <>
                <h1 className="text-base font-medium text-gray-950 uppercase">
                  {toCamelCase(data?.heroStrip)}
                </h1>
                <h2 className="text-4xl lg:text-5xl font-bold !leading-[120%] font-manrope">
                  <PortableText value={data?.heroheading} components={components} />
                </h2>
              </>
            ): data?.heroStrip ?(
              <h1 className="text-4xl lg:text-5xl font-bold !leading-[120%] tracking-[-0.8px] font-manrope">
                {data?.heroStrip}
              </h1>
            ): null}

            {data?.heroDescription && (
              <div ref={descriptionRef} className="w-full">
                <PortableText
                  value={data?.heroDescription}
                  components={descriptionComponents}
                />
              </div>
            )}
            {!showFullDescription && needsSeeMore && (
              <button
                onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                className="text-base font-medium text-vs-purple hover:text-vs-purple/80 transition-colors mt-2 self-center"
              >
                {isDescriptionExpanded ? 'See Less' : 'See More'}
              </button>
            )}

            {data?.bookBtnContent &&
              Array.isArray(data.bookBtnContent) &&
              data.bookBtnContent.length > 0 && (
                <div className="flex flex-col gap-4 pt-5 justify-center lg:justify-start items-center ">
                  
                    {/* If 2 or fewer buttons, show them in a row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      {data.bookBtnContent.map((button: any, index: number) => {
                        if (!button?.buttonText) return null
                        // Default first button to 'primary' if buttonType is not set or is empty
                        const buttonType =
                          index === 0 &&
                          (!button?.buttonType || button?.buttonType === '')
                            ? 'primary'
                            : button?.buttonType || 'secondary'
                        return (
                          <Button
                            key={button?._key || index}
                            type={buttonType}
                            className="w-fit"
                            link={button?.buttonLink}
                            buttonVariant={button?.buttonVariant}
                            target={
                              data.bookBtnContent[index]?.openInNewTab
                                ? '_blank'
                                : '_self'
                            }
                          >
                            {button?.buttonIcon && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: button.buttonIcon,
                                }}
                              />
                            )}
                            <span>{button.buttonText}</span>
                          </Button>
                        )
                      })}
                    </div>
                  
                </div>
            )}

            {contactData && (
              <div className="flex flex-col md:flex-row gap-4 pt-5 justify-center lg:justify-start items-center ">
                {page == 'contact' ? (
                  <>
                    <Button type="secondaryTel" link={`tel:${formatPhoneNumberWithCountryCode(contactData.phoneNumber, router.locale)}`}>
                      <span>{contactData.phoneNumber}</span>
                    </Button>
                    <Button type="secondaryMail" link={`mailto:${contactData.salesEmail}`}>
                      <span>{contactData.salesEmail}</span>
                    </Button>
                  </>
                ): page == 'support' ? (
                  <>
                    <Button type="secondaryTel" link={`tel:${formatPhoneNumberWithCountryCode(contactData.supportPhoneNumber, router.locale)}`}>
                      <span>{contactData.supportPhoneNumber}</span>
                    </Button>
                    <Button type="secondaryMail" link={`mailto:${contactData.contactEmail}`}>
                      <span>{contactData.contactEmail}</span>
                    </Button>
                  </>
                ): null}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-between lg:gap-24 gap-12 w-full items-center lg:items-start">
            {/* Left Content */}
            <div className="space-y-3 flex-1 max-w-[607px] w-full justify-center lg:justify-start flex flex-col pt-8 lg:py-sm xl:py-md">
              {/* Feature Tag */}
              {page === 'home' ? (
                <div className="flex w-fit mx-auto lg:mx-0 text-center lg:text-left items-center space-x-2 rounded-full border border-[rgba(174,160,255,0.20)] bg-[rgba(174,160,255,0.20)] py-[9px] pl-4 pr-[14px]">
                  <span className="hidden md:block">
                    <SuperChargeIcon />
                  </span>
                  <h1 className="text-sm font-medium text-gray-950 uppercase">
                    {data?.heroStrip}
                  </h1>
                </div>
              ) : (
                <div className="text-center lg:text-left">
                  <h1 className="text-base font-medium text-gray-950 uppercase">
                    {toCamelCase(data?.heroStrip)}
                  </h1>
                </div>
              )}

              {/* Main Headline */}
              <div className="space-y-4 text-center lg:text-left">
                <h2 className="text-4xl lg:text-5xl font-bold !leading-[120%]  font-manrope">
                  <PortableText
                    value={data?.heroheading}
                    components={components}
                  />
                </h2>
              </div>

              {/* Description */}
              <div
                ref={descriptionRef}
                className="w-full lg:text-left text-center"
              >
                <PortableText
                  value={data?.heroDescription}
                  components={descriptionComponents}
                />
              </div>
              {!showFullDescription && needsSeeMore && (
                <button
                  onClick={() =>
                    setIsDescriptionExpanded(!isDescriptionExpanded)
                  }
                  className="text-base font-medium text-vs-purple hover:text-vs-purple/80 transition-colors mt-2 lg:self-start"
                >
                  {isDescriptionExpanded ? 'See Less' : 'See More'}
                </button>
              )}

              {data?.bookBtnContent &&
                Array.isArray(data.bookBtnContent) &&
                data.bookBtnContent.length > 0 && (
                  <div className="flex flex-col !mt-0 gap-4 pt-12 justify-center lg:justify-start items-center lg:items-start">
                    {data.bookBtnContent.length > 2 ? (
                      <>
                        {/* First button on top */}
                        {data.bookBtnContent[0]?.buttonText && (
                          <Button
                            key={data.bookBtnContent[0]?._key || 0}
                            type={
                              !data.bookBtnContent[0]?.buttonType ||
                              data.bookBtnContent[0]?.buttonType === ''
                                ? 'primary'
                                : data.bookBtnContent[0]?.buttonType ||
                                  'secondary'
                            }
                            className="w-fit"
                            link={data.bookBtnContent[0]?.buttonLink}
                            buttonVariant={
                              data.bookBtnContent[0]?.buttonVariant
                            }
                          >
                            {data.bookBtnContent[0]?.buttonIcon && (
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: data.bookBtnContent[0].buttonIcon,
                                }}
                              />
                            )}
                            <span>{data.bookBtnContent[0].buttonText}</span>
                          </Button>
                        )}
                        {/* Remaining buttons in a row */}
                        <div className="flex flex-col sm:flex-row gap-4">
                          {data.bookBtnContent
                            .slice(1)
                            .map((button: any, index: number) => {
                              if (!button?.buttonText) return null
                              return (
                                <Button
                                  key={button?._key || index + 1}
                                  type={button?.buttonType || 'secondary'}
                                  className="w-fit"
                                  link={button?.buttonLink}
                                  buttonVariant={button?.buttonVariant}
                                >
                                  {button?.buttonIcon && (
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: button.buttonIcon,
                                      }}
                                    />
                                  )}
                                  <span>{button.buttonText}</span>
                                </Button>
                              )
                            })}
                        </div>
                      </>
                    ) : (
                      /* If 2 or fewer buttons, show them in a row */
                      <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start">
                        {data.bookBtnContent.map(
                          (button: any, index: number) => {
                            // Default first button to 'primary' if buttonType is not set or is empty
                            const buttonType =
                              index === 0 &&
                              (!button?.buttonType || button?.buttonType === '')
                                ? 'primary'
                                : button?.buttonType || 'secondary'
                            return (
                              <Button
                                key={button?._key || index}
                                type={buttonType}
                                className="w-fit"
                                link={button?.buttonLink}
                                buttonVariant={button?.buttonVariant}
                              >
                                {button?.buttonIcon && (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: button.buttonIcon,
                                    }}
                                  />
                                )}
                                <span>{button?.buttonText}</span>
                              </Button>
                            )
                          },
                        )}
                      </div>
                    )}
                  </div>
                )}
            </div>

            {/* Right Content - Video Section */}
            <HeroRightSection data={data} />
          </div>
        )}
      </Container>
    </section>
  )
}

export default HeroSection
