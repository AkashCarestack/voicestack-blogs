import React, { useState } from 'react'
import { IdataProps } from './interface/common'

export default function switchableTabs({
  data,
  setActiveTab,
}: {
  data: IdataProps[]
  setActiveTab: (key: string) => void
}) {

  const [activeKey, setActiveKey] = useState(data[0]?.key)

  const handleTabClick = (key: string) => {
    setActiveKey(key)
    setActiveTab(key)
  }

  return (
    <div className="flex gap-2.5 w-full justify-center items-center lg:mb-24 mb-8">
        <div className='lg:shadow-lg lg:rounded-[500px] p-1.5 flex flex-col lg:flex-row gap-2.5 w-full lg:w-fit'>
        {data.map((item, idx) => (
        <button
          key={item.key}
          onClick={() => handleTabClick(item.key)}
          className={` text-left lg:text-center cursor-pointer font-base font-geist leading-normal tracking-normal px-5 pt-2.5 pb-2.5 rounded-3xl transition-all duration-200 ease-in-out border border-transparent ${
            activeKey === item.key
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
