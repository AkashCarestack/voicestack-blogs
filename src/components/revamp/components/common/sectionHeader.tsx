import React from 'react'
import { SectionHeaderProps } from './interface/common'

export default function SectionHeader(data: SectionHeaderProps) {
  return (
    <div className={`flex justify-center ${data.className}`}>
         <div className='lg:w-[606px] w-full text-center'>
          <h2 className={`leading-[120%] tracking-normal lg:mb-4 mb-2 ${data.headingSm ? 'text-xl lg:text-2xl font-medium' : 'font-manrope font-bold lg:text-[40px] text-2xl '}`}>{data.heading}</h2>
      
          <p className='text-gray-700 lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue' dangerouslySetInnerHTML={{ __html: data.description }}></p>
        <a href={`mailto:${data.mailId}`} className='text-[#4A3CE1]  text-base font-medium leading-[145%]'>{data.mailId}</a>
    </div>
    </div>
   
  )
}
