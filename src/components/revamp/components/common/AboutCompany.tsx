import React from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from './sectionHeader'

export default function AboutCompany({ heading, description }: { heading: string, description: string }) {
 
  return (
    <Section>
        <Container className='flex flex-col gap-4 text-center'> 
            <h2 className="leading-[120%] tracking-normal lg:mb-4 mb-2 font-manrope font-bold lg:text-[40px] text-2xl text-gray-900">{heading}</h2>
            <p className='lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue text-gray-700'>{description}</p>
            
        </Container>
    </Section>
  )
}
