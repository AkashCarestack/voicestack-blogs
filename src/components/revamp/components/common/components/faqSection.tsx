import React, { use, useEffect, useState } from 'react'
import { FaqSectionProps } from '../interface/common'
import { PortableText } from '@portabletext/react'
import { Minus, Plus } from 'lucide-react'
import SectionHeader from '../sectionHeader'
import Container from '~/components/structure/Container'

export default function FaqSection({ faqItems }: FaqSectionProps) {
  const [isOpen, setIsOpen] = useState({})

  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-gray-600 md:text-base text-sm leading-[145%]">
          {children}
        </p>
      ),
    },
  }

  return (
    <Container className='py-16 flex-col'>
      <SectionHeader
        heading={'Frequently Asked Questions'}
        description={'For queries contact'}
        mailId={'support@voicestack.com'}
      />

      <div className="lg:columns-2 [column-gap:1.5rem]">
        {faqItems &&faqItems?.map((item, index) => {
          const isExpanded = !!isOpen[index]
          return (
            <div
              key={index}
              className="lg:max-w-[560px] w-full p-6 border  break-inside-avoid border-[#E5E7EB] rounded-[16px] cursor-pointer transition-all duration-300  mb-6"
              onClick={() =>
                setIsOpen((prev) => ({ ...prev, [index]: !prev[index] }))
              }
            >
              <div className="flex justify-between items-center">
                <h3 className={`md:text-lg text-base text-gray-950 font-medium leading-[155.55%] font-geist ${isExpanded && 'mb-4'}`}>
                  {item.question}
                </h3>
                {isExpanded ? (
                  <Minus className="flex-shrink-0" height={16} width={16} />
                ) : (
                  <Plus className="flex-shrink-0" height={16} width={16} />
                )}
              </div>
              <div
                className="overflow-hidden transition-all duration-300"
                aria-hidden={!isExpanded}
              >
                {Array.isArray(item.answer) && isExpanded && (
                  <PortableText value={item.answer} components={components} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Container>
  )
}
