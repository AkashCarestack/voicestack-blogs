import React from 'react'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Container from '~/components/structure/Container'

interface TablistSectionProps {
  data: any
}

export default function TablistSection({ data }:TablistSectionProps ) {
  const headerData = {
    heading: data?.content?.sections[0]?.data.headline,
    description: data?.content?.sections[0]?.data.subDescription,
  }
  return (
    <Section className="py-sm md:py-md md:pb-16 bg-[#F9F9F9]">
      <Container>
        <div className="flex flex-col items-center w-full gap-16">
          <SectionHeader
            heading={headerData.heading}
            description={headerData.description}
          />
          <ListingWithTabs list={data} slug="effortlessly-handle" />
          <div className="flex justify-center">
            <Button type="primary">
              <span>
                {'Book Free Demo'}
              </span>
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}
