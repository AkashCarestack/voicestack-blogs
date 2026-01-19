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
  shadow = true,
  isSkip = false,
  fullWidth = false,
}: {
  data: IdataProps[]
  setActiveTab: (key: string) => void
  isSticky?: boolean
  activeTab?: string
  className?: string
  isShowImage?: boolean
  shadow?: boolean
  isSkip?: boolean
  fullWidth?: boolean
}) {
  const { scrollUp, scrollDown } = useScrollListen()
  const refElement = useRef<(HTMLButtonElement | null)[]>([])
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  const isScrollingRef = useRef(false)

  const scrollToActiveTab = (key: string, smooth = true) => {
    const activeIndex = data.findIndex((item) => (item.key || item.id) === key)
    const targetElement = refElement.current[activeIndex]
    const container = scrollContainerRef.current

    if (targetElement && container) {
      isScrollingRef.current = true
      
      const elementLeft = targetElement.offsetLeft
      const elementWidth = targetElement.offsetWidth
      const containerWidth = container.offsetWidth
      
      // Calculate the position to center the element
      const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2)
      
      container.scrollTo({
        left: scrollPosition,
        behavior: smooth ? 'smooth' : 'auto',
      })

      // Reset scrolling flag after animation
      if (smooth) {
        setTimeout(() => {
          isScrollingRef.current = false
        }, 500)
      } else {
        isScrollingRef.current = false
      }
    } else if (targetElement) {
      // Fallback to scrollIntoView if container ref is not available
      targetElement.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        inline: 'center',
        block: 'nearest',
      })
    }
  }

  const handleTabClick = (key: string) => {
    setActiveTab(key)
    scrollToActiveTab(key, true)
  }

  // Auto-center active tab when it changes (e.g., from scroll)
  useEffect(() => {
    if (activeTab && !isScrollingRef.current) {
      // Use requestAnimationFrame to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          scrollToActiveTab(activeTab, true)
        })
      }, 100) // Small delay to ensure refs are set
      
      return () => clearTimeout(timeoutId)
    }
  }, [activeTab, data])


  // Firefox-only border fix and scrollbar hide
  useEffect(() => {
    const styleId = 'switchable-tabs-firefox-fix'
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style')
      style.id = styleId
      style.textContent = `
        @-moz-document url-prefix() {
          .rounded-full button.rounded-3xl {
            -moz-appearance: none !important;
            background-image: none !important;
            border-width: 1px !important;
            border-style: solid !important;
          }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  return (
    <div
      // className={`${isSticky && 'sticky'} ${scrollUp ? 'md:top-[-5px] top-0 ' : 'md:top-[38px] top-0'} flex ${fullWidth ? 'gap-[10px]' : 'gap-2.5'} w-full justify-center items-center transition-all duration-300 ease-in-out ${fullWidth ? 'px-4 md:px-12' : 'px-2 md:px-0'} ${className || ''}`}
      className={`${isSticky && 'sticky'} top-0 flex ${fullWidth ? 'gap-[10px]' : 'gap-2.5'} w-full justify-center items-center transition-all duration-300 ease-in-out ${fullWidth ? 'px-4 md:px-12' : 'px-0 md:px-0'} ${className || ''}`}
      style={{
        position: isSticky ? 'sticky' : 'relative',
      }}
    >
      <div
        ref={scrollContainerRef}
        className={
          fullWidth
            ? 'bg-white border md:border-gray-200 border-transparent rounded-[500px] md:p-[6px] p-1 flex gap-[10px] w-full transition-all duration-300 ease-in-out overflow-x-auto overflow-y-hidden scrollbar-hide whitespace-nowrap'
            : `lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] md:rounded-full md:p-1.5 p-1 flex flex-row gap-2.5 lg:w-fit w-full lg:bg-white bg-white ${shadow ? 'lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]' : 'md:border border-gray-200  lg:shadow-none'} overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide scrollbar-none transition-all duration-300 ease-in-out`
        }
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {data.map((item, idx) => {
          const itemKey = item.key || item.id || idx.toString()
          const isActive = (activeTab || data[0]?.key || data[0]?.id || '0') === itemKey
          
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
              className={`focus:outline-none text-center md:text-base text-sm lg:text-center cursor-pointer font-geist leading-normal tracking-normal md:px-5 px-3 ${fullWidth ? '' : 'md:pt-2.5 md:pb-2.5'} pt-1.5 pb-1.5 rounded-3xl transition-all duration-200 ease-in-out whitespace-nowrap ${fullWidth ? 'flex-1' : 'flex-shrink-0'} ${
                isActive
                  ? 'bg-gray-950 text-white border border-transparent shadow-[0_0_0_2px_#030712] lg:shadow-[0_0_0_2px_#030712]'
                  : 'text-gray-950 border border-[rgba(255,255,255,0.60)] bg-tab-hover-gradient shadow-[0_0_0_2px_#CAC5FF] lg:border-transparent lg:bg-transparent lg:shadow-[0_0_0_2px_#CAC5FF] hover:border-[rgba(255,255,255,0.60)] hover:bg-tab-hover-gradient hover:shadow-[0_0_0_2px_#CAC5FF]'
              }`}
              style={{
                MozAppearance: 'none',
              }}
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
