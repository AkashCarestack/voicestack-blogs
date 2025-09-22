import React from 'react'
import { SectionHeaderProps } from './interface/common'

export default function sectionHeader(data: SectionHeaderProps) {
  return (
    <div className='flex justify-center'>
         <div className='lg:w-[606px] w-full text-center lg:py-16 py-8'>
        <h2 className='font-manrope lg:text-[40px] text-2xl font-bold leading-[120%] tracking-normal lg:mb-4 mb-2'>{data.heading}</h2>
     
        <p className='text-gray-700 font-geist lg:text-lg text-base font-normal leading-[155.55%]'>{data.description}</p>
    </div>
    </div>
   
  )
}
