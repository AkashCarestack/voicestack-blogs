import React from 'react'
import { SectionHeaderPropsV2 } from '../../../components/revamp/components/common/interface/common'
import SectionH2 from '~/components/typography/revamp/SectionH2'
import Button from '~/components/common/Button'
import { PortableText, PortableTextReactComponents } from '@portabletext/react'

export default function SectionHeaderV2({ showFullLength = false, demoButton = false, headingMd = false, aiSection = false, ...data }: SectionHeaderPropsV2) {
  // Check if heading is portable text (array) or string  
  const components: Partial<PortableTextReactComponents> = {
    block: {
      normal: ({ children }) => (
        <p className="[&_br]:hidden md:[&_br]:block lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue text-gray-500">{children}</p>
      ),
    },
    marks: {
      
      strong: ({ children }) => <b className="font-normal text-gray-950">{children}</b>,
      link: ({ value, children }) => {
        const target = value?.blank ? '_blank' : undefined
        const rel = value?.blank ? 'noopener noreferrer' : undefined
        return (
          <a href={value?.href} target={target} rel={rel} className="underline hover:opacity-80">
            {children}
          </a>
        )
      },
    },
  }
  
  return (
    <div className={`flex ${data.isLeftAlign ? 'justify-start' : 'justify-center'} ${data.className}`}>
      <div className={`w-full ${data.isLeftAlign ? 'text-left' : 'text-center'} ${showFullLength ? 'lg:w-full' : 'lg:w-[712px]'}`}>
          <SectionH2 
            content={data.heading}
            isWhite={data.isWhite}
            headingSm={data.headingSm}
            headingMd={headingMd}
            aiSection={aiSection}
          />
          {
            Array.isArray(data.description) ? <PortableText value={data.description} components={components} /> :
            <p className={`${aiSection? 'text-gray-300' : '' } ${showFullLength ? 'lg:max-w-full' : 'lg:max-w-[712px]'} lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue ${data.isWhite ? 'text-white' : 'text-gray-500'}`} dangerouslySetInnerHTML={{ __html: data?.description }}></p>
          }

          {data.ctaListItems && data.ctaListItems.length > 0 && (
            <div className='flex flex-col md:flex-row justify-center gap-4 items-center mt-8'>
              {data.ctaListItems?.map((btn: any, key: number) => {
                return (
                  <Button link={btn.ctaLink} key={`${btn.ctaText}-${key}`} type={btn?.ctaType || 'primary'}>
                    <span>{btn.ctaText}</span>
                  </Button>
                )
              })}
            </div>
          )}
          {demoButton && (
            <div className={`flex mt-8 ${data.isLeftAlign ? 'justify-start' : 'justify-center'}`}>
              <Button type="primary" link="/demo">
                <span className="">Book Free Demo</span>
              </Button>
            </div>
          )}
      </div>
    </div>  
   
  )
}
