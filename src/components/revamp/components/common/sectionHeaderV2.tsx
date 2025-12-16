import React from 'react'
import { SectionHeaderPropsV2 } from './interface/common'
import SectionH2 from '~/components/typography/revamp/SectionH2'

export default function SectionHeaderV2({ showFullLength = false, ...data }: SectionHeaderPropsV2) {
  // Check if heading is portable text (array) or string
  // const isPortableText = Array.isArray(data.heading)
  
  return (
    <div className={`flex ${data.isLeftAlign ? 'justify-start' : 'justify-center'} ${data.className}`}>
      <div className={`w-full ${data.isLeftAlign ? 'text-left' : 'text-center lg:w-[850px]'} `}>
          <SectionH2 
            content={data.heading}
            isWhite={data.isWhite}
            headingSm={data.headingSm}
          />
          <p className={` lg:w-[850px] lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue ${data.isWhite ? 'text-white' : 'text-gray-500'}`} dangerouslySetInnerHTML={{ __html: data.description }}></p>
      </div>
    </div>  
   
  )
}
