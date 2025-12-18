import React from 'react'
import { SectionHeaderPropsV2 } from './interface/common'
import SectionH2 from '~/components/typography/revamp/SectionH2'
import Button from '~/components/common/Button'

export default function SectionHeaderV2({ showFullLength = false, ...data }: SectionHeaderPropsV2) {
  // Check if heading is portable text (array) or string
  // const isPortableText = Array.isArray(data.heading)
  
  return (
    <div className={`flex ${data.isLeftAlign ? 'justify-start' : 'justify-center'} ${data.className}`}>
      <div className={`w-full ${data.isLeftAlign ? 'text-left' : 'text-center lg:w-[712px]'} `}>
          <SectionH2 
            content={data.heading}
            isWhite={data.isWhite}
            headingSm={data.headingSm}
          />
          <p className={`lg:w-[712px] lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue ${data.isWhite ? 'text-white' : 'text-gray-500'}`} dangerouslySetInnerHTML={{ __html: data.description }}></p>

          {data.ctaListItems && data.ctaListItems.length > 0 && (
            <div className='flex justify-center gap-4 items-center mt-8'>
              {data.ctaListItems?.map((btn: any, key: number) => {
                return (
                  <Button link={btn.ctaLink} key={`${btn.ctaText}-${key}`} type={btn?.ctaType || 'primary'}>
                    <span>{btn.ctaText}</span>
                  </Button>
                )
              })}
            </div>
          )}
      </div>
    </div>  
   
  )
}
