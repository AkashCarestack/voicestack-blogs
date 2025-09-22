import React from 'react'
import Queries from '~/components/revamp/queries'
import { GetStaticProps } from 'next'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import Button from '~/components/common/Button'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'

interface TestShakirProps {
  data: any
}

export default function TestShakir({ data }: TestShakirProps) {
  console.log(data)
  const headerData = {
    heading: data?.content?.sections[0]?.data.headline,
    description: data?.content?.sections[0]?.data.subDescription,
  }
  return (
    <Section className="flex flex-col">
      <Container className="py-16 flex-col">
        {/* <div className="w-full"> */}
      
        <SectionHeader
        heading={headerData.heading}
        description={headerData.description}
   
      />
          <ListingWithTabs list={data} slug="effortlessly-handle" />
        {/* </div> */}
        <div className="flex justify-center pt-16">
        <Button type="primary" className="w-fit">
          <span className="rounded-[8px] border border-white/10 bg-[#B5EB92] px-6 py-2.5 text-black font-medium">
            {'Book Free Demo'}
          </span>
        </Button>
      </div>
      </Container>

    </Section>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const queries = new Queries('easily-handle')
  const data = await queries.getData()

  return {
    props: {
      data,
    },
  }
}
