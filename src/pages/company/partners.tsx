import { GetStaticProps } from 'next'
import React from 'react'

import LogoListingSection from '~/components/LogoListingSection'
import CardsWithTestimonial from '~/components/revamp/components/common/cardsWithTestimonial'
import FeatureCategoryGrid from '~/components/revamp/components/common/FeatureCategoryGrid/FeatureCategoryGrid'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import PartnerLogoListing from '~/components/revamp/components/common/partnerLogoListing'
import PartnersReferralSection from '~/components/revamp/components/common/partnerReferalSection'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { getClient } from '~/lib/sanity.client'

// Define proper TypeScript interfaces

export default function PartnersPage({ pageData, region }) {
  // Transform partner-logos data for FeatureCategoryGrid
  const transformPartnerLogosData = (logosData: any[]) => {
    if (!logosData || !Array.isArray(logosData) || logosData.length === 0) {
      return { groupedData: {}, getCategoryDisplayName: () => '' }
    }

    // Group all logos into a single category
    const groupedData = {
      partners: logosData.map((item: any) => ({
        id: item._key || item._id || Math.random().toString(),
        title:
          item.heading ||
          item.image?.title ||
          item.image?.altText ||
          item.image?.originalFilename?.replace(/\.[^/.]+$/, '') ||
          'Partner',
        icon: item.icon || item.dynamicSvg || null,
        ...item,
      })),
    }

    const getCategoryDisplayName = (key: string) => {
      if (key === 'partners') return 'Partners'
      return key.replaceAll('-', ' ')
    }

    return { groupedData, getCategoryDisplayName }
  }

  const partnerLogosData = pageData['partner-logos']?.componentData?.items || pageData['partner-logos']?.componentData || []
  const { groupedData, getCategoryDisplayName } = transformPartnerLogosData(partnerLogosData)

  return (
    <>
      <div
        className="pt-lg pb-md"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        {pageData['partners-hero']?.componentData && (
          <HeroSection
            page=""
            isCentered={true}
            showFullDescription={true}
            data={pageData['partners-hero']?.componentData}
          />
        )}
      </div>
      {pageData['partner-logos']?.componentData && (
        <PartnerLogoListing data={pageData['partner-logos']?.componentData} />
      )}
      {/* {pageData['partner-feature']?.componentData && (
        <CardsWithTestimonial
          data={pageData['partner-feature']?.componentData}
        />
      )} */}
      {Object.keys(groupedData).length > 0 && (
        <Section className="md:py-12 py-6">
          <Container className="flex flex-col items-center gap-16">
          <SectionHeader heading={pageData['partner-feature']?.componentData?.heading} description={pageData['partner-feature']?.componentData?.description} />
            <FeatureCategoryGrid
              groupedData={groupedData}
              getCategoryDisplayName={getCategoryDisplayName}
            />
          </Container>
        </Section>
      )}
      <PartnersReferralSection data={undefined} />
      {pageData['logo-tabs']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pageData['logo-tabs']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={pageData['logo-tabs']?.componentData}
        />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const client = getClient()
    const queries = new Queries('partners', region)
    const slug =
      region === 'en' ? 'partners' : `partners-${region.toLowerCase()}`

    // Fetch page data for integrations
    const pageData = await queries.getPageData('company', slug)

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    return {
      props: {
        pageData,
        region,
      },
    }
  } catch (error) {
    console.error('Error fetching integrations page data:', error)
    return {
      notFound: true,
    }
  }
}
