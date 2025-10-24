import React from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import ClickableCards from '~/components/revamp/components/common/ClickableCards'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'

export default function CustomerStories({ pageData }: any) {

  const data = pageData['Powering-Startup'].componentData

  return (
    data &&
    <Section className="flex-col md:gap-[32px] gap-6 py-sm md:py-md lg:py-lg">
      <SectionHeader
        heading={data?.heading}
        description={data?.description}
      />
      <ClickableCards data={data?.items} />
      <div className='flex justify-center'>
        <Button className='w-fit' type='primary' link='/dental-phones/customer-stories'><span>Book Free Demo</span></Button>
      </div>
    </Section>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'
  const client = getClient()

  try {
    const queries = new Queries('dentalPhones', region)
    const slug = region === 'en' ? 'customer-stories' : `customer-stories-${region.toLowerCase()}`
    const pageData = await queries.getPageData('dentalPhones', slug)

    return {
      props: {
        pageData: pageData || null
      },
    }
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return {
      props: {
        pageData: null
      },
     
    }
  }
}
