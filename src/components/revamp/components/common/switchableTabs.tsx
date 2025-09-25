import React, { useEffect, useRef, useState } from 'react'
import { IdataProps } from './interface/common'

export default function SwitchableTabs({
  data,
  setActiveTab,
  isSticky = false,
  activeTab,
}: {
  data: IdataProps[]
  setActiveTab: (key: string) => void
  isSticky?: boolean
  activeTab?: string
}) {

  const refElement = useRef<(HTMLButtonElement | null)[]>([])

  const handleTabClick = (key: string) => {
    const activeIndex = data.findIndex(item => item.key === key)
    const targetElement = refElement.current[activeIndex]
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
    setActiveTab(key)
  }

  return (
    <div className={`${isSticky ? 'lg:sticky top-[100px]' : ''} flex gap-2.5 w-full justify-center items-center`}>
        <div className='lg:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] lg:rounded-[500px] p-1.5 flex flex-row 
        gap-2.5  lg:w-fit lg:bg-white bg-transparent 
         overflow-x-auto whitespace-nowrap scrollbar-hide scrollbar-none'>
        {data.map((item, idx) => (
        <button
          ref={(el) => {
            if (refElement.current) {
              refElement.current[idx] = el
            }
          }}
          key={item.key}
          id={item.key}
          onClick={() => handleTabClick(item.key)}
          className={` text-left lg:text-center cursor-pointer font-base font-geist leading-normal tracking-normal px-5 pt-2.5 pb-2.5 rounded-3xl transition-all duration-200 ease-in-out border border-transparent ${
            (activeTab || data[0]?.key) === item.key
              ? 'bg-gray-950 text-white'
              : 'text-gray-950 hover:border-[rgba(255,255,255,0.60)] hover:bg-tab-hover-gradient hover:shadow-[0_0_0_2px_#CAC5FF]'
          }`}
        >
          {item.title}
        </button>
      ))}
        </div>
      
    </div>
  )
}
