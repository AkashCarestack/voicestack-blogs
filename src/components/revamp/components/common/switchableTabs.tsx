import React, { useEffect, useRef, useState } from 'react'
import { IdataProps } from './interface/common'
import useScrollListen from '~/components/common/hooks/scrollListen'
import ImageLoader from '~/components/common/imageLoader/imageLoader'

export default function SwitchableTabs({
  data,
  setActiveTab,
  isSticky = false,
  activeTab,
  className,
  isShowImage = false,
}: {
  data: IdataProps[]
  setActiveTab: (key: string) => void
  isSticky?: boolean
  activeTab?: string
  className?: string
  isShowImage?: boolean
}) {
  console.log(data, 'tttt data')
  const { scrollUp, scrollDown } = useScrollListen()

  const refElement = useRef<(HTMLButtonElement | null)[]>([])

  const handleTabClick = (key: string) => {
    const activeIndex = data.findIndex((item) => (item.key || item.id) === key)
    const targetElement = refElement.current[activeIndex]

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
    setActiveTab(key)
  }

  return (
    <div
      className={`${isSticky && 'sticky'} ${scrollUp ? 'md:top-[-5px] top-[28px] ' : 'md:top-[35px] top-[35px]'} flex gap-2.5 w-full justify-center items-center transition-all duration-300 ease-in-out ${className}`}
    >
      <div
        className="lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-full p-1.5 flex flex-row 
        gap-2.5  lg:w-fit lg:bg-white bg-white 
         overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none transition-all duration-300 ease-in-out"
      >
        {data.map((item, idx) => {
          const itemKey = item.key || item.id || idx.toString()
          return (
            <button
              ref={(el) => {
                if (refElement.current) {
                  refElement.current[idx] = el
                }
              }}
              key={itemKey}
              id={itemKey}
              onClick={() => handleTabClick(itemKey)}
              className={` text-left md:text-base text-xs lg:text-center cursor-pointer font-base font-geist leading-normal tracking-normal md:px-5 px-3 md:pt-2.5 pt-1.5 md:pb-2.5 pb-1.5 rounded-3xl transition-all duration-200 ease-in-out ${
                (activeTab || data[0]?.key || data[0]?.id || '0') === itemKey
                  ? 'bg-gray-950 text-white border border-transparent'
                  : 'text-gray-950 border border-[rgba(255,255,255,0.60)] bg-tab-hover-gradient shadow-[0_0_0_2px_#CAC5FF] lg:border-transparent lg:bg-transparent lg:shadow-none hover:border-[rgba(255,255,255,0.60)] hover:bg-tab-hover-gradient hover:shadow-[0_0_0_2px_#CAC5FF]'
              }`}
            >
              {isShowImage ? (
                <div
                  className="items-center justify-center"
                  style={{
                    height: `48px`,
                    width: `${
                      48 *
                        item?.testimonial?.logo?.metadata?.dimensions
                          ?.aspectRatio || 2
                    }px`,
                  }}
                >
                  <ImageLoader
                    image={item?.testimonial?.logo?.url}
                    alt={item?.testimonial?.logo?.altText}
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                item.title
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
