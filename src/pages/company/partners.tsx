import { GetStaticProps } from 'next'
import FeatureCategoryGrid from '~/components/revamp/components/common/FeatureCategoryGrid/FeatureCategoryGrid'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import PartnerLogoListing from '~/components/revamp/components/common/partnerLogoListing'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import { getClient } from '~/lib/sanity.client'

// Define proper TypeScript interfaces

export default function PartnersPage({ pageData, region }) {
  const cardList = pageData['partner-feature']?.componentData?.items

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
      {cardList && cardList.length > 0 && (
        <Section className="md:py-12 py-6">
          <Container className="flex flex-col items-center gap-8">
            <FeatureCategoryGrid
              data={cardList}
              displayMode="individual"
              fieldMapping={{
                id: '_key',
                title: 'heading',
                icon: 'dynamicSvg',
              }}
              ctaCard={{
                title: 'Curious if Voicestack Fits Your Practice',
                buttonText: 'Book Free Demo',
                buttonLink: '/demo',
              }}
            />
          </Container>
        </Section>
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
