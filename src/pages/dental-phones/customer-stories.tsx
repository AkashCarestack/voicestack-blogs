import React from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import ClickableCards from '~/components/revamp/components/common/ClickableCards'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Section from '~/components/structure/Section'






export default function CustomerStories({pageData}: any) {
    
    // Add null check for pageData and the specific section
    const data = pageData?.['Powering-Startup']?.componentData

    // Return early if no data is available
    if (!data) {
      return (
        <Section className="flex-col md:gap-[32px] gap-6 py-sm md:py-md lg:py-lg">
          <div className="text-center py-8">
            <p className="text-gray-600">Content is currently unavailable.</p>
          </div>
        </Section>
      )
    }

  return (
    <Section className="flex-col md:gap-[32px] gap-6 py-sm md:py-md lg:py-lg">
      <SectionHeader
        heading={data?.heading}
        description={data?.description}
      />
        <ClickableCards data ={data?.items} />
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
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return {
      props: {
        pageData: null
      },
      revalidate: 60
    }
  }
}
