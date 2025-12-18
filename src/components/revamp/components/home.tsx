import React from 'react'
import LogoSliderSection from '~/components/LogoSliderSection'
import HeroSection from './common/HeroSection/heroSection'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import Testimonials from '~/components/revamp/components/common/Testimonials/Testimonials'
import CardListing from './cardListing'
import StatisticsSection from './StatisticsSection'
import LogoListingSection from '~/components/LogoListingSection'
import FaqSection from '~/components/revamp/components/common/faqSection'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import SiteComparisonSection from '~/components/SiteComparisonSection'

export default function Home({
  data,
  featuresData,
  comparisonLegendData,
  comparisonTableData,
  comparisonSectionData,
}: {
  data: any
  featuresData: any
  comparisonLegendData: any
  comparisonTableData: any
  comparisonSectionData: any
}) {
  return (
    <div className="">
      {data && (
        <div className="px-4 xl:px-12 pt-2">
          <div
            className="rounded-[12px] md:rounded-[24px] bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA] py-12"
            style={{
              background:
                ' linear-gradient(270deg, #F0EFFA 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
            }}
          >
            <HeroSection
              data={data['home-hero']?.componentData}
              page="home"
            />
          </div>
        </div>
      )}

      {/* Logo Slider Section */}
      {data['logo-listing']?.componentData && (
        <LogoSliderSection
          data={data['logo-listing']?.componentData?.blocksListingData}
        />
      )}

      {/* Vertical Testimonial Listing */}
      {data['testimonial-video-section']?.componentData?.refData
        ?.testimonialListing && (
        <VerticalTestimonialListing
          data={
            data['testimonial-video-section']?.componentData?.refData
              ?.testimonialListing
          }
        />
      )}

      {/* Testimonials Section */}
      {data['testimonial-category-section']?.componentData?.refData
        ?.tabsListingComponent && (
        <Testimonials
          data={
            data['testimonial-category-section']['componentData']['refData']
              ?.tabsListingComponent
          }
        />
      )}

      {/* Card Listing / Business Outcomes */}
      {data['business-outcomes']?.componentData?.refData
        ?.tabsListingComponent && (
        <CardListing
          data={
            data['business-outcomes']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      )}

      {/* Category Feature Tabs */}
      {featuresData && <CategoryFeatureTabs features={featuresData || []} />}

      {comparisonLegendData && (
        <SiteComparisonSection
          variant="V2"
          data={comparisonSectionData}
          legendData={comparisonLegendData}
        />
      )}

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Logo Listing Section */}
      {data['logo-listing']?.componentData && (
        <LogoListingSection
          data={data['logo-listing']?.componentData?.blocksListingData}
        />
      )}

      {/* FAQ Section */}
      {data.faqData && <FaqSection faqItems={data.faqData[0]} />}
    </div>
  )
}
