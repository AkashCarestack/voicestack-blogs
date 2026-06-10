import React from 'react'

import LogoListingV2 from '~/v2/sections/LogoListingV2'
import CallFlowAnalyticsSection from '~/v2/components/CallFlowAnalyticsSection'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import CardWIthGraph from '~/components/revamp/components/common/cardWIthGraph'
import FaqSection from '~/components/revamp/components/common/faqSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import SimpleHead from '~/components/common/SimpleHead'
import RelatedFeature from '~/v2/components/common/RelatedFeature'
import { useRelatedFeatures } from '~/hooks/useRelatedFeatures'
import { getFeatureBasePath } from '~/lib/featurePage'

export interface FeatureDetailPageProps {
  pageData: any
  faq: any
  region: string
  slug: string
  features?: any[]
}

export default function FeatureDetailPage({
  pageData,
  faq,
  region,
  slug,
  features = [],
}: FeatureDetailPageProps) {
  const relatedFeaturesList = useRelatedFeatures(features, slug)
  const featureBasePath = getFeatureBasePath(region)

  return (
    <>
      <SimpleHead data={pageData?.seo} />
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />

      {pageData['feature-hero']?.componentData && (
        <FeatureHero
          data={pageData['feature-hero']?.componentData}
          type="feature"
        />
      )}

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['the-missing-visibility']?.componentData && (
        <GroupedCardsGridSection
          data={pageData['the-missing-visibility']?.componentData}
          sectionBorder="b"
        />
      )}

      {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.genericListingComponent}
          sectionBorder="b"
        />
      )}

      {pageData['feature-testimonials-section-single']?.componentData && (
        <FeatureTestimonialsSection
          data={pageData['feature-testimonials-section-single']?.componentData}
        />
      )}

      <CallFlowAnalyticsSection
        data={pageData['call-flow-analytics']?.componentData}
      />

      {pageData['benefits-of-healthcare']?.componentData && (
        <GroupedCardsGridSection
          data={pageData['benefits-of-healthcare']?.componentData}
          theme="dark"
        />
      )}

      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}

      {pageData['feature-testimonials-section']?.componentData && (
        <FeatureTestimonialsSection
          data={pageData['feature-testimonials-section']?.componentData}
        />
      )}

      {pageData['better-decisions']?.genericListingComponent && (
        <CardWIthGraph
          data={pageData['better-decisions']?.genericListingComponent}
        />
      )}
      
      {faq && <FaqSection key={`${slug}-${faq?._id ?? 'faq'}`} faqItems={faq} />}

      {relatedFeaturesList.length > 0 && (
        <RelatedFeature
          data={relatedFeaturesList}
          currentSlug={slug}
          basePath={featureBasePath}
        />
      )}
    </>
  )
}
