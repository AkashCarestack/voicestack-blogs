import { PortableText } from '@portabletext/react'
import React, { useState } from 'react'

import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import SectionHeader from '../sectionHeader'

export default function HoverTestimonial({ data }: any) {
  console.log(data, 'data in hover testimonial')
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState<number>(0) // Default to first card

  const tabs = data?.tabs || []
  // Use hovered card if hovering, otherwise use active card
  const activeTab = tabs[hoveredIndex !== null ? hoveredIndex : activeIndex] || tabs[0]

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-base leading-relaxed">{children}</p>
      ),
    },
  }

  return (
    <Section className="relative py-sm md:py-md lg:py-lg bg-[#F9F9F9]">
      <Container className="w-full relative">
        <div className="flex flex-col items-center w-full gap-12">
          {/* Section Header */}
          <SectionHeader heading={data?.headline}  description={data?.subDescription}/>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row w-full gap-8">
            {/* Left Column - Feature Cards */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              {tabs.map((tab, index) => {
                const isHovered = hoveredIndex === index
                const isActive = activeIndex === index && hoveredIndex === null
                const isHighlighted = isHovered || isActive

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
                    {/* Pointer arrow for active/hovered card */}
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
              })}
            </div>

            {/* Right Column - Dynamic Content */}
            <div className="w-full lg:w-1/2 flex flex-col gap-4">
              {/* Testimonial Block */}
              {activeTab?.testimonial && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  {activeTab?.testimonial?.subStatement && (
                    <blockquote className="text-base md:text-lg text-gray-700 mb-4 font-manrope leading-relaxed">
                      {/* &ldquo;{activeTab.testimonial.mainStatement}&rdquo; */}
                      <PortableText value={activeTab?.testimonial?.subStatement} components={components} />
                    </blockquote>
                  )}
                  {activeTab.testimonial.name && (
                    <div className="flex flex-col">
                      <p className="font-semibold text-gray-900">
                        {activeTab.testimonial.name}
                      </p>
                      {activeTab.testimonial.designation && (
                        <p className="text-sm text-gray-600">
                          {activeTab.testimonial.designation}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Statistic Block */}
              {activeTab?.testimonial?.listItems?.map((item: any) => item.isHighlighted) && (
                <div className="bg-[#F4F3FA] rounded-lg p-6">
                  {activeTab?.testimonial?.listItems?.map((item: any) => item.isHighlighted && (
                    <div key={item._key}>
                      {item.after && (
                        <div className="text-4xl md:text-5xl font-bold text-[#4A3CE1] mb-2 font-manrope">
                          {item.after}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Image Block - Show tab image or testimonial image */}
              {(activeTab?.testimonial?.testimonialImage) && (
                <div className="rounded-lg overflow-hidden">
                  <ImageLoader
                    image={activeTab?.testimonial?.testimonialImage?.url}
                    imageClassName="w-full h-auto object-cover"
                    alt={
                      activeTab.tabSubHeading ||
                      activeTab.testimonial?.name ||
                      'Feature image'
                    }
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

