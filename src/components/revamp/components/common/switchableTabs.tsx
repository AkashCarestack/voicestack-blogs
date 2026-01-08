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

  const handleTabClick = (key: string) => {
    const activeIndex = data.findIndex((item) => (item.key || item.id) === key)
    const targetElement = refElement.current[activeIndex]

    if (targetElement) {
      setActiveTab(key);
      targetElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      })
    }
  }

  // Handle skip button - scroll to next section in document
  const handleSkip = () => {
    if (!isSkip) return;
    
    // Find the current section element by traversing up the DOM
    let currentElement: HTMLElement | null = refElement.current[0]?.parentElement || null;
    while (currentElement && currentElement.tagName.toLowerCase() !== 'section') {
      currentElement = currentElement.parentElement;
    }
    
    if (!currentElement) return;
    
    // Find next section sibling
    let nextSection: HTMLElement | null = currentElement.nextElementSibling as HTMLElement;
    while (nextSection && nextSection.tagName.toLowerCase() !== 'section') {
      nextSection = nextSection.nextElementSibling as HTMLElement;
    }
    
    if (nextSection) {
      const headerHeight = 100;
      const elementTop = nextSection.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementTop - headerHeight;
      
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      });
    }
  }

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
      className={`${isSticky && 'sticky'} ${scrollUp ? 'md:top-[-5px] top-0 ' : 'md:top-[38px] top-0'} flex ${isSkip || fullWidth ? 'gap-[10px]' : 'gap-2.5'} w-full justify-center items-center transition-all duration-300 ease-in-out ${isSkip || fullWidth ? 'px-12' : ''} ${className || ''}`}
      style={{
        position: isSticky ? 'sticky' : 'relative',
      }}
    >
      <div
        className={
          isSkip || fullWidth
            ? 'bg-white border border-gray-200 rounded-[500px] p-[6px] flex gap-[10px] w-full transition-all duration-300 ease-in-out'
            : `lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] rounded-full p-1.5 flex flex-row gap-2.5 lg:w-fit w-full lg:bg-white bg-white ${shadow ? 'lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]' : 'border border-gray-200 lg:shadow-none'} overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide scrollbar-none transition-all duration-300 ease-in-out`
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
              className={`focus:outline-none text-left md:text-base text-xs lg:text-center cursor-pointer font-geist leading-normal tracking-normal md:px-5 px-3 ${fullWidth ? '' : 'md:pt-2.5 md:pb-2.5'} pt-1.5 pb-1.5 rounded-3xl transition-all duration-200 ease-in-out ${isSkip || fullWidth ? 'flex-1' : 'flex-shrink-0'} ${
                isActive
                  ? 'bg-gray-950 text-white border border-transparent'
                  : 'text-gray-950 border border-[rgba(255,255,255,0.60)] bg-tab-hover-gradient shadow-[0_0_0_2px_#CAC5FF] lg:border-transparent lg:bg-transparent lg:shadow-none hover:border-[rgba(255,255,255,0.60)] hover:bg-tab-hover-gradient hover:shadow-[0_0_0_2px_#CAC5FF]'
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
      {isSkip && (
        <div className="bg-white border border-gray-200 rounded-[500px] px-5 py-[6px] flex gap-[6px] items-center justify-center shrink-0 sticky top-0 transition-all duration-200 ease-in-out hover:border-[rgba(255,255,255,0.60)] hover:bg-tab-hover-gradient hover:shadow-[0_0_0_2px_#CAC5FF]">
          <button
            onClick={handleSkip}
            className="text-gray-950 border border-[rgba(255,255,255,0.60)] rounded-[500px] pb-3 pt-2.5 px-0 flex items-center gap-[4px] transition-all duration-200 ease-in-out bg-white shadow-[0_0_0_2px_white]"
          >
            <span className="font-geist font-normal text-base text-gray-950 leading-6 whitespace-nowrap">Skip</span>
            <div className="relative shrink-0 w-5 h-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="w-full h-full"
              >
                <path
                  d="M17.5 3.33337V16.6667"
                  stroke="#030712"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.02417 3.57089C4.77126 3.41914 4.48261 3.33723 4.18769 3.33351C3.89278 3.32979 3.60216 3.40439 3.3455 3.54971C3.08884 3.69503 2.87534 3.90585 2.7268 4.16065C2.57826 4.41546 2.5 4.70512 2.5 5.00006V15.0001C2.5 15.295 2.57826 15.5847 2.7268 15.8395C2.87534 16.0943 3.08884 16.3051 3.3455 16.4504C3.60216 16.5957 3.89278 16.6703 4.18769 16.6666C4.48261 16.6629 4.77126 16.581 5.02417 16.4292L13.355 11.4309C13.6023 11.2831 13.8071 11.0738 13.9494 10.8233C14.0917 10.5728 14.1666 10.2897 14.1668 10.0016C14.1671 9.71351 14.0927 9.43028 13.9508 9.17953C13.809 8.92878 13.6045 8.71908 13.3575 8.57089L5.02417 3.57089Z"
                  stroke="#030712"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
