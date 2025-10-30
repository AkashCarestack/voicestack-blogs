import React from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import ImageCardSection from '~/components/revamp/components/common/ImageCardSection'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'
import MasonryCardGridSection from '~/components/revamp/components/common/MasonryCardGridSection'

export default function CustomerStories({ pageData }: any) {
  const data =
    pageData &&
    pageData['Powering-Startup'] &&
    pageData['Powering-Startup'].componentData
  const masonryData =
    pageData &&
    pageData['featured-practice-stories'] &&
    pageData['featured-practice-stories'].componentData

  return (
    data && (
      <>
        {masonryData && <MasonryCardGridSection data={masonryData} />}
        {data && (
          <ImageCardSection
            data={data?.items}
            heading={data?.heading}
            description={data?.description}
          />
        )}
      </>
    )
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('dentalPhones', region)
    const slug =
      region === 'en'
        ? 'customer-stories'
        : `customer-stories-${region.toLowerCase()}`
    const pageData = await queries.getPageData('dentalPhones', slug)

    return {
      props: {
        pageData: pageData || null,
      },
    }
  } catch (error) {
    console.error('Error fetching customer stories:', error)
    return {
      props: {
        pageData: null,
      },
    }
  }
}
