import Image from 'next/image'
import React from 'react'

import Button from '~/components/common/Button'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

import CardsList from './cardsList'
import SectionHeader from './sectionHeader'
import { PortableText } from '@portabletext/react'
import TestimonialRightCard from './testimonialRightCard'

export default function CardsWithTestimonial({ data }: { data: any }) {
  const components: any = {
    block: {
      normal: ({ children }: { children: React.ReactNode }) => (
        <p className="text-xl md:text-[32px] font-medium leading-[40px] font-manrope">
          &ldquo;{children}&rdquo;
        </p>
      ),
      blockquote: ({ children }: { children: React.ReactNode }) => (
        <blockquote className="text-xl md:text-[32px] font-medium leading-[40px] font-manrope">
          &ldquo;{children}&rdquo;
        </blockquote>
      ),
    },
    marks: {
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="text-[#B5EB92]">{children}</span>
      ),
    },
  }
  return (
    <Section className="py-sm md:py-md lg:py-lg bg-white ">
      <Container className="flex-col gap-16">
        <SectionHeader heading={data?.heading} description={data.description} />
        <CardsList data={data} />
        {data?.testimonial && (
          <div className="relative flex flex-col lg:flex-row w-full rounded-[24px] overflow-hidden min-h-[480px]">
            <Image
              src="/assets/Bg/BG01.png"
              alt={data?.testimonial?.name || 'Background'}
              fill
              className="object-cover z-0"
              priority
            />
            <div className="relative w-full flex flex-col lg:flex-row gap-3 z-10 min-h-[480px]">
              <div className="w-full flex-1">
                <TestimonialRightCard data={data} page="aiPage"/>
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}
