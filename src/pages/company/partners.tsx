import { GetStaticProps } from 'next'
import ImageLoader from '~/components/common/imageLoader/imageLoader'
import SimpleHead from '~/components/common/SimpleHead'
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
    <SimpleHead data={pageData?.seo} />
      <div
        className="py-12"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        {pageData['partners-hero']?.componentData && (
          <HeroSection
            page="partners"
            isCentered={true}
            showFullDescription={true}
            data={pageData['partners-hero']?.componentData}
          />
        )}
      </div>
      {pageData['partner-logos']?.componentData && (
        <PartnerLogoListing data={pageData['partner-logos']?.componentData} refer={pageData['partner-logos']?.componentData?.blocksListingData}/>
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

          <div className="grid md:grid-cols-3 grid-cols-1 gap-6 justify-center">
            {pageData['customer-love']?.componentData?.items.map((item) => (
              <div
                key={item._key}
                className="flex gap-3 p-4 md:p-8 rounded-[6px] md:rounded-[12px] bg-[#F4F3FA]"
              >
                <span className="w-5 h-5 mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16.7048 4.15303C16.7834 4.21266 16.8494 4.28719 16.8991 4.37236C16.9488 4.45753 16.9812 4.55166 16.9945 4.64938C17.0078 4.74709 17.0017 4.84646 16.9765 4.94181C16.9513 5.03716 16.9076 5.1266 16.8478 5.20503L8.84782 15.705C8.78293 15.7901 8.70059 15.8603 8.60634 15.9109C8.51209 15.9615 8.4081 15.9913 8.30135 15.9984C8.19461 16.0056 8.08758 15.9897 7.98745 15.9521C7.88732 15.9144 7.79641 15.8557 7.72082 15.78L3.22082 11.28C3.08834 11.1379 3.01622 10.9498 3.01965 10.7555C3.02308 10.5612 3.10179 10.3758 3.2392 10.2384C3.37661 10.101 3.562 10.0223 3.7563 10.0189C3.9506 10.0154 4.13865 10.0876 4.28082 10.22L8.17482 14.113L15.6548 4.29603C15.7752 4.13799 15.9534 4.03416 16.1502 4.00735C16.3471 3.98054 16.5466 4.03294 16.7048 4.15303Z"
                    fill="#00A63E"
                  />
                </svg>
                </span>
                <p className="text-base md:text-xl">{item.heading}</p>
              </div>
            ))}
          </div>
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
