import React from 'react'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import SectionHeader from '../sectionHeader'
import SwitchableTabs from '../switchableTabs'

export default function SingleTabCardListing({ data }: { data: any }) {
  return (
    <Section className='py-sm md:py-md lg:py-lg'>
        <Container className='flex flex-col items-center'>
            <SectionHeader
                heading={data?.headline}
            />
            {/* <SwitchableTabs
                data={data?.tabs}
                // activeTab={data?.activeTab}
                // setActiveTab={data?.setActiveTab}
            /> */}

        </Container>
    </Section>
  )
}
