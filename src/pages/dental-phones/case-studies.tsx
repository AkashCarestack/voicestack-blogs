import React from 'react'
import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import Queries from '~/components/revamp/queries'
import ImageCardSection from '~/components/revamp/components/common/ImageCardSection'
import SectionHeader from '~/components/revamp/components/common/sectionHeader'
import Section from '~/components/structure/Section'
import Button from '~/components/common/Button'
import MasonryCardGridSection from '~/components/revamp/components/common/MasonryCardGridSection'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import SimpleHead from '~/components/common/SimpleHead'
import Testimonials from '~/components/revamp/components/common/Testimonials/Testimonials'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StatisticsSection from '~/components/revamp/components/StatisticsSection'
import LogoListingSection from '~/components/LogoListingSection'
import PracticeCards from '~/components/revamp/components/common/PracticeCards/practiceCards'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'

export default function CustomerStories({ pageData }: any) {
  console.log(pageData, 'pageData in case studies')
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
      <SimpleHead data={pageData?.seo} />
       <div
        className="py-12"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        <Breadcrumb breadCrumb={pageData?.breadCrumb} />
        <HeroSection
          page=""
          data={pageData['dental-phones-hero']?.componentData}
          isCentered={true}
          showFullDescription={true}
        />
        {/* {pageData['testimonial-tabs']?.componentData && (
            <StackCardTestimonial page="case-studies" data={pageData['testimonial-tabs']?.componentData} />
        )} */}

        {pageData['testimonial-tabs']?.componentData && (
          <CategoryFeatureTabs page="case-studies" sectionHeading={pageData['testimonial-tabs']?.componentData} features={pageData['testimonial-tabs']?.componentData?.tabs} />
        )}
        </div>

         {pageData['custom']?.componentData && (
        <div className="">
          <IntegrationsGrid data={pageData['custom']?.componentData} />
        </div>
      )}
        
        <StatisticsSection />
        {pageData['logo-listing']?.componentData && (
          <LogoListingSection
            data={pageData['logo-listing']?.componentData?.blocksListingData}
            header={false}
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
        ? 'case-studies'
        : `case-studies-${region.toLowerCase()}`
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