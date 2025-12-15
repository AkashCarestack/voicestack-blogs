import React from 'react'
import { SectionHeaderPropsV2 } from './interface/common'

export default function SectionHeaderV2({ showFullLength = false, ...data }: SectionHeaderPropsV2) {
  return (
    <div className={`flex ${data.isLeftAlign ? 'justify-start' : 'justify-center'} `}>
      <div className={`w-full ${data.isLeftAlign ? 'text-left' : 'text-center lg:w-[850px]'} ${data.className}`}>
        <h2
          dangerouslySetInnerHTML={{ __html: data.heading }}
          className={`${showFullLength ? 'w-full' : 'lg:w-[850px]'} [&_br]:hidden md:[&_br]:block leading-[120%] tracking-normal lg:mb-4 mb-2 ${data.headingSm ? 'text-xl lg:text-2xl font-medium' : `font-manrope font-bold lg:text-4xl text-3xl ${data.isWhite ? 'text-white' : 'text-gray-900'}`}`}></h2>
        <p className={` lg:w-[850px] lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue ${data.isWhite ? 'text-white' : 'text-gray-700'}`} dangerouslySetInnerHTML={{ __html: data.description }}></p>
      </div>
    </div>  
   
  )
}
