import React from 'react'
import Queries from '~/components/revamp/queries'
import { GetStaticProps } from 'next'
import ListingWithTabs from '~/components/revamp/components/common/listingwithTabs'
import Section from '~/components/structure/Section'
import Container from '~/components/structure/Container'
import Button from '~/components/common/Button'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import FaqSection from '~/components/revamp/components/common/components/faqSection'

interface TestShakirProps {
  data: any
}

export default function TestShakir({ data }: TestShakirProps) {
  const headerData = {
    heading: data?.content?.sections[0]?.data.headline,
    description: data?.content?.sections[0]?.data.subDescription,
  }
  return (
    <Section className="flex flex-col bg-[#F4F3FA]">
      <Container className="py-16 flex-col">
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
      <FaqSection faqItems={data?.faq.faqItems} />
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
