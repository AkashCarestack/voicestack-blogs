import React from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from './sectionHeader'

export default function AboutCompany() {
    const heading="About VoiceStack";
    const description="VoiceStack’s mission is to transform how dental practices communicate, grow, and serve patients. Built with the needs of modern practices in mind, VoiceStack delivers an AI-powered enterprise phone system that streamlines communication, eliminates missed opportunities, and strengthens patient relationships. Our platform brings together advanced VoIP, conversational AI, marketing attribution, and seamless integrations to help practices convert more calls, boost productivity, and accelerate revenue growth. Designed for single-site clinics, fast-growing groups, and large DSOs, VoiceStack is engineered to scale effortlessly across locations while supporting unique workflows. We combine deep expertise in dental operations with best-in-class communication technology to give practices a system that is intuitive, reliable, and truly built for growth. VoiceStack is trusted by some of the most successful dental groups in the United States to improve call performance, increase patient conversions, and unlock measurable business outcomes. Our commitment is simple. Deliver the most modern AI tools and the most powerful enterprise phone system so dental teams can focus on exceptional patient care and long-term practice success."
  return (
    <Section>
        <Container className='flex flex-col gap-4 text-center'> 
            <h2 className="leading-[120%] tracking-normal lg:mb-4 mb-2 font-manrope font-bold lg:text-[40px] text-2xl text-gray-900">{heading}</h2>
            <p className='lg:text-lg text-base font-normal leading-[155.55%] [&_span]:text-vs-blue text-gray-700'>{description}</p>
            
        </Container>
    </Section>
  )
}
