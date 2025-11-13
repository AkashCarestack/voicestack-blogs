import { GetStaticProps } from 'next'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FeatureCategoryGrid from '~/components/revamp/components/common/FeatureCategoryGrid/FeatureCategoryGrid'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import PartnerLogoListing from '~/components/revamp/components/common/partnerLogoListing'
import PartnersReferralSection from '~/components/revamp/components/common/partnerReferalSection'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import Queries from '~/components/revamp/queries'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'

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
        <Breadcrumb
          breadCrumb={pageData?.breadCrumb}
        />
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
        <Section className="py-sm md:py-md lg:py-lg">
          <Container className="flex flex-col items-center gap-16">
            <SectionHeader
              heading={pageData['partner-feature']?.componentData?.heading}
              description={
                pageData['partner-feature']?.componentData?.description
              }
            />
            <FeatureCategoryGrid
              data={cardList}
              showTickIcon={false}
              displayMode="individual"
              fieldMapping={{
                id: '_key',
                title: 'heading',
                icon: 'dynamicSvg',
              }}
            />
          </Container>
        </Section>
      )}
      <PartnersReferralSection data={undefined} />
      <Section className="py-sm md:py-md lg:py-lg">
        <Container className="flex flex-col items-center gap-16">
          <SectionHeader
            heading={pageData['customer-love']?.componentData?.description}
          />
          <FeatureCategoryGrid
            data={pageData['customer-love']?.componentData?.items}
            showTickIcon={false}
            displayMode="individual"
            fieldMapping={{
              id: '_key',
              title: 'heading',
              icon: 'dynamicSvg',
            }}
          />
        </Container>
      </Section>

      {pageData['logo-tabs']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pageData['logo-tabs']?.componentData?.refData?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial data={pageData['logo-tabs']?.componentData} />
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
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
