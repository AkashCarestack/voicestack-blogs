import React, { useContext, useState } from 'react'

import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import SectionHeader from './sectionHeader'
import IconBadge from './iconBadge'
import Image from 'next/image'
import { BookDemoContext } from '~/providers/BookDemoProvider'
import { FormModal } from '~/components/common/FormModal'
import CardsList from './cardsList'

export default function CardsWithTestimonial({ data }: { data: any }) {
  const [openForm, setOpenForm] = useState(false)
  const { isDemoPopUpShown } = useContext(BookDemoContext)
  console.log(data, 'data in cards with testimonial')
  return (
    <Section className="py-sm md:py-md lg:py-lg bg-white ">
      <Container className="flex-col gap-16">
        <SectionHeader heading={data?.heading} description={data.description} />
        <CardsList data={data} />
        {data?.testimonial && (
          <div className="relative flex flex-col lg:flex-row w-full rounded-[24px] overflow-hidden min-h-[480px]">
            <Image
              src="/assets/Bg/BG01.png"
              alt={data?.testimonial?.name || 'Background'}
              fill
              className="object-cover z-0"
              priority
            />
            <div className="relative w-full flex flex-col lg:flex-row gap-3 z-10 min-h-[480px]">
              <div className="w-full flex-1">
                <div className="relative h-full md:mb-0 mb-4">
                  {/* desktop */}
                  <div className="relative  text-white flex w-full h-full">
                    <div className="flex flex-col gap-3 py-8 px-6 max-w-[740px] w-full">
                      {/* Company Logo */}
                      <div className="flex flex-1">
                        <div
                          className="relative"
                          style={{
                            height: `38px`,
                            width: `${
                              38 *
                              data?.testimonial?.secondaryLogo?.metadata
                                ?.dimensions?.aspectRatio
                            }px`,
                          }}
                        >
                          <ImageLoader
                            key={`testimonial-logo-${data?.testimonial?._id || data?.testimonial}`}
                            image={data?.testimonial?.secondaryLogo?.url}
                            className="w-full h-full object-contain"
                            alt={
                              data?.testimonial?.secondaryLogo?.altText ||
                              'Brand Logo'
                            }
                          />
                        </div>
                      </div>
                      {/* Metrics overlay */}
                      <div className="flex flex-col gap-12">
                        {data?.testimonial?.listItems?.length > 0 ? (
                          <div className="relative grid grid-cols-2  gap-y-3 gap-x-6 md:gap-x-14">
                            {data?.testimonial?.listItems?.map(
                              (metric, index) => (
                                <div
                                  key={index}
                                  className="text-white py-3 border-b border-white/30 "
                                >
                                  <div
                                    className="text-lg md:text-[32px] font-semibold testimonial-metric inline font-manrope"
                                    dangerouslySetInnerHTML={{
                                      __html: metric?.after
                                        ? metric?.after
                                        : metric?.description,
                                    }}
                                  />
                                  <div className="text-sm md:text-base text-white opacity-70">
                                    {metric?.listHeading}
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        ) : (
                          <div className="relative flex text-lg text-white">
                            <div className="text-lg md:text-[32px] font-semibold leading-[120%] font-manrope">
                              {data?.testimonial?.testimonialdescription}
                            </div>
                          </div>
                        )}
                        <div className="items-center gap-4 flex sm:hidden">
                          <div
                            className="relative"
                            style={{
                              height: `451px`,
                              width: `${
                                451 *
                                data?.testimonial?.testimonialImage?.metadata
                                  ?.dimensions?.aspectRatio
                              }px`,
                            }}
                          >
                            <ImageLoader
                              key={`testimonial-image-${data?.testimonial?._id || data?.testimonial}`}
                              image={data?.testimonial?.testimonialImage}
                              className="w-full h-full object-contain"
                              imageClassName="w-full h-auto object-contain"
                            />
                          </div>
                          <div className="flex flex-col gap-1 text-white text-sm font-semibold">
                            <p className="font-semibold">
                              {data?.testimonial?.name}
                            </p>
                            <p className=" text-white/60">
                              {data?.testimonial?.designation}
                            </p>
                          </div>
                        </div>

                        {data?.ctaListItems?.length > 0 && (
                          <div className="flex flex-col sm:flex-row gap-4 pt-5 justify-center lg:justify-start items-center lg:items-start >">
                            <Button
                              type="primary"
                              className="w-fit"
                              onClick={() => {
                                setOpenForm(true)
                              }}
                            >
                              <span>
                                {data?.ctaListItems[0]?.ctaText ||
                                  'Book Free Demo'}
                              </span>
                            </Button>
                            <Button
                              type="secondary"
                              className="w-fit text-white"
                            >
                              {data?.ctaListItems[1]?.ctaText || 'See Pricing'}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="relative w-full  items-end justify-end hidden sm:flex">
                      <div
                        className="relative"
                        style={{
                          height: `451px`,
                          width: `${
                            451 *
                            data?.testimonial?.testimonialImage?.metadata
                              ?.dimensions?.aspectRatio
                          }px`,
                        }}
                      >
                        <ImageLoader
                          key={`testimonial-image-${data?.testimonial?._id || data?.testimonial}`}
                          image={data?.testimonial?.testimonialImage}
                          className="w-full h-full object-contain"
                          imageClassName="w-full h-auto object-contain"
                        />
                      </div>
                      <div className="absolute bottom-8 right-0">
                        <div className="flex flex-col py-6 pl-6 pr-8 rounded-l-[12px] rounded-r-none bg-white/5 backdrop-blur-[20px]">
                          <p className="font-medium text-lg text-white">
                            {data?.testimonial?.name}
                          </p>
                          <p className=" text-white/60 text-base font-normal">
                            {data?.testimonial?.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
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
