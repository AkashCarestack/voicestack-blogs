import React from 'react'
import { SectionHeaderProps } from './interface/common'

export default function SectionHeader({ showFullLength = false, ...data }: SectionHeaderProps) {
  return (
    <div className={`flex ${data.isLeftAlign ? 'justify-start' : 'justify-center'} `}>
         <div className={`w-full ${data.isLeftAlign ? 'text-left' : 'text-center lg:w-[850px]'} ${data.className}`}>
          <h2
          dangerouslySetInnerHTML={{ __html: data.heading }}
          
           className={`${showFullLength ? 'w-full' : 'lg:w-[850px]'} leading-[120%] tracking-normal lg:mb-4 mb-2 ${data.headingSm ? 'text-xl lg:text-2xl font-medium' : `font-manrope font-bold lg:text-[40px] text-2xl ${data.isWhite ? 'text-white' : 'text-gray-900'}`}`}></h2>
      
          <p className={` lg:w-[850px] lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue ${data.isWhite ? 'text-white' : 'text-gray-700'}`} dangerouslySetInnerHTML={{ __html: data.description }}></p>
        <a href={`mailto:${data.mailId}`} className='text-[#4A3CE1]  text-base font-medium leading-[145%]'>{data.mailId}</a>
    </div>
    </div>
   
  )
}
