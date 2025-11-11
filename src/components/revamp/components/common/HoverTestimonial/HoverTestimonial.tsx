import { PortableText } from '@portabletext/react'
import React, { useState } from 'react'
import Slider from 'react-slick'

import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import SectionHeader from '../sectionHeader'

// Custom Arrow Components for Mobile Slider
const PrevArrow = ({ onClick, currentSlide }: any) => {
  const isDisabled = currentSlide === 0

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center
        ${isDisabled ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-white hover:bg-gray-100 transition-colors shadow-md'}`}
      aria-label="Previous"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        className="rotate-180"
      >
        <path
          d="M5 12H19"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

const NextArrow = ({ onClick, currentSlide, slideCount }: any) => {
  const isDisabled = currentSlide >= slideCount - 1

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-10 h-10 rounded-full flex items-center justify-center
        ${isDisabled ? 'bg-gray-300 cursor-not-allowed opacity-50' : 'bg-white hover:bg-gray-100 transition-colors shadow-md'}`}
      aria-label="Next"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M5 12H19"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 5L19 12L12 19"
          stroke="#030712"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}

export default function HoverTestimonial({ data }: any) {
  console.log(data, 'data in hover testimonial')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0) // Default to first card
  const [currentSlide, setCurrentSlide] = useState(0)

  const tabs = data?.tabs || []
  // Use hovered card if hovering, otherwise use active card
  const activeTab = tabs[hoveredIndex !== null ? hoveredIndex : activeIndex] || tabs[0]

  const quoteComponents: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-base md:text-xl text-[#030712] font-medium leading-[140%]">
          &ldquo;{children}&rdquo;
        </p>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="text-base md:text-xl text-[#030712] font-medium leading-[140%]">
          &ldquo;{children}&rdquo;
        </blockquote>
      ),
    },
  }
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-sm md:text-base">{children}</p>
      ),
    },
  }

  // Slider ref for manual navigation
  const sliderRef = React.useRef<any>(null)

  // Slider settings for mobile
  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // Disable default arrows since we're using custom ones outside
    afterChange: (index: number) => {
      setCurrentSlide(index)
      setActiveIndex(index)
    },
  }

  // Render content for a tab (used in both mobile slider and desktop)
  const renderTabContent = (tab: any, index: number, isMobileSlide = false) => {
    const isHovered = hoveredIndex === index
    const isActive = activeIndex === index && hoveredIndex === null
    // In mobile slider, always highlight the current slide
    const isHighlighted = isMobileSlide || isHovered || isActive

    return (
      <div
        key={tab._key || index}
        className={`relative transition-all duration-300 ease-in-out rounded-lg p-6 cursor-pointer ${
          isHighlighted
            ? 'bg-[#4A3CE1] text-white'
            : 'bg-transparent text-gray-900'
        }`}
        onMouseEnter={() => setHoveredIndex(index)}
        onMouseLeave={() => {
          setHoveredIndex(null)
        }}
        onClick={() => setActiveIndex(index)}
      >
        {/* Pointer arrow for active/hovered card - Desktop only */}
        {isHighlighted && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full hidden lg:block z-10">
            <svg
              width="12"
              height="24"
              viewBox="0 0 12 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 0L12 12L0 24V0Z"
                fill="#4A3CE1"
              />
            </svg>
          </div>
        )}

        {/* Label */}
        {tab.tabHeading && (
          <div
            className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
              isHighlighted ? 'text-white' : 'text-gray-600'
            }`}
          >
            {tab.tabHeading}
          </div>
        )}

        {/* Title */}
        {tab.tabSubHeading && (
          <h3
            className={`text-lg font-bold mb-3 font-manrope ${
              isHighlighted ? 'text-white' : 'text-gray-900'
            }`}
          >
            {tab.tabSubHeading}
          </h3>
        )}

        {/* Description - Show on hover/active */}
        {isHighlighted && tab.description && (
          <div
            className={`text-sm leading-relaxed transition-all duration-300 ${
              isHighlighted ? 'text-white' : 'text-gray-700'
            }`}
          >
            <PortableText value={tab.description} components={components} />
          </div>
        )}
      </div>
    )
  }

  // Render right section content for a tab
  const renderRightContent = (tab: any) => {
    // Filter all highlighted listItems
    const highlightedStatistics = tab?.testimonial?.listItems?.filter(
      (item: any) => item?.isHighlighted === true
    ) || []

    return (
      <div className="w-full max-w-[643px] flex flex-col lg:flex-row gap-4 rounded-[24px] bg-gradient-to-br from-[#F4F3FA] to-[#E0DDFF] p-3 min-h-[400px] lg:min-h-[500px]">
        {/* Left: Testimonial Block */}
        {tab?.testimonial && (
          <div className="w-full lg:w-auto lg:flex-1 p-6 flex flex-col justify-between min-h-full">
            {tab?.testimonial?.subStatement && (
              <div className="text-base md:text-xl text-[#030712] mb-4 font-medium leading-[140%] min-h-[224px]">
                {Array.isArray(tab.testimonial.subStatement) && tab.testimonial.subStatement.length > 0 ? (
                  <PortableText value={tab.testimonial.subStatement} components={quoteComponents} />
                ) : typeof tab.testimonial.subStatement === 'string' ? (
                  <p>&ldquo;{tab.testimonial.subStatement}&rdquo;</p>
                ) : null}
              </div>
            )}
            {tab.testimonial.name && (
              <div className="flex flex-col mt-auto">
                <p className="font-semibold text-gray-900">
                  {tab.testimonial.name}
                </p>
                {tab.testimonial.designation && (
                  <p className="text-sm text-gray-600">
                    {tab.testimonial.designation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right: Statistics and Image Stacked */}
        <div className="w-full lg:w-auto lg:flex-1 flex flex-col gap-4 min-h-full">
          {/* Statistic Blocks - Show all highlighted items */}
          {highlightedStatistics.length > 0 && highlightedStatistics.map((statistic: any, index: number) => (
            <div key={statistic._key || index} className="bg-[#E0DDFF] rounded-[14px] p-6 flex flex-col gap-12">
              {statistic.after && (
                <div className="text-4xl md:text-6xl font-bold text-[#4A3CE1] mb-2 font-manrope">
                  {statistic.after}
                </div>
              )}
              {statistic.listHeading && (
                <p className="text-4xl md:text-6xl font-bold text-[#4A3CE1] leading-relaxed font-manrope">
                  {statistic.listHeading}
                </p>
              )}
              {statistic.description && !statistic.after && (
                <div className="text-sm md:text-base text-[#4A3CE1] leading-relaxed">
                  <PortableText value={statistic.description} components={components} />
                </div>
              )}
            </div>
          ))}

          {/* Image Block */}
          {tab?.testimonial?.testimonialImage && (
            <div className="rounded-[14px] overflow-hidden hidden lg:block">
              <div
                className=""
                style={{
                  height: `257px`,
                  width: `${
                    257 *
                    (tab?.testimonial?.testimonialImage?.metadata
                      ?.dimensions?.aspectRatio || 1)
                  }px`,
                }}
              >
                <ImageLoader
                  image={tab?.testimonial?.testimonialImage}
                  imageClassName="w-full h-auto object-cover rounded-[14px]"
                  alt={
                    tab.tabSubHeading ||
                    tab.testimonial?.name ||
                    'Feature image'
                  }
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <Section className="relative py-sm md:py-md lg:py-lg bg-[#F9F9F9]">
      <Container className="w-full relative">
        <div className="flex flex-col items-center w-full gap-12">
          {/* Section Header */}
          <SectionHeader heading={data?.headline}  description={data?.subDescription}/>

          {/* Main Content */}
          {/* Mobile View - Slider (below md) */}
          <div className="w-full md:hidden">
            <div className="relative">
              <Slider ref={sliderRef} {...sliderSettings}>
                {tabs.map((tab, index) => (
                  <div key={tab._key || index} className="px-2">
                    <div className="flex flex-col gap-4">
                      {/* Left Card - Always highlighted in mobile slider */}
                      {renderTabContent(tab, index, true)}
                      {/* Right Content */}
                      {renderRightContent(tab)}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            {/* Navigation Arrows - Outside content section */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <PrevArrow
                currentSlide={currentSlide}
                onClick={() => sliderRef.current?.slickPrev()}
              />
              <NextArrow
                currentSlide={currentSlide}
                slideCount={tabs.length}
                onClick={() => sliderRef.current?.slickNext()}
              />
            </div>
          </div>

          {/* Desktop View - Hover Layout (md and above) */}
          <div className="hidden md:flex flex-col lg:flex-row w-full gap-8 justify-between">
            {/* Left Column - Feature Cards */}
            <div className="w-full max-w-[501px] flex flex-col gap-4">
              {tabs.map((tab, index) => renderTabContent(tab, index))}
            </div>

            {/* Right Column - Dynamic Content */}
            {renderRightContent(activeTab)}
          </div>
        </div>
      </Container>
    </Section>
  )
}

