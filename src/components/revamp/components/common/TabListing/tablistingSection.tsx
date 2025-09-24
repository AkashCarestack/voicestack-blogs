import React from 'react'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'

interface TablistSectionProps {
  data: any
}

export default function TablistSection({ data }:TablistSectionProps ) {
    console.log({data})
  const headerData = {
    heading: data?.content?.sections[0]?.data.headline,
    description: data?.content?.sections[0]?.data.subDescription,
  }
  return (
    <Section className="flex flex-col bg-[#F9F9F9]">
        <SectionHeader
        heading={headerData.heading}
        description={headerData.description}
      />
          <ListingWithTabs list={data} slug="effortlessly-handle" />
        <div className="flex justify-center pt-16">
        <Button type="primary" className="w-fit">
          <span className="rounded-[8px] border border-white/10 bg-[#B5EB92] px-6 py-2.5 text-black font-medium">
            {'Book Free Demo'}
          </span>
        </Button>
      </div>
    </Section>
  )
}
