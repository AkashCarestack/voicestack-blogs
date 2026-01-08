import { GetStaticProps } from 'next'
import React from 'react'
import SimpleHead from '~/components/common/SimpleHead'
import LogoListingV2 from '~/v2/sections/LogoListingV2'
import Breadcrumb from '~/components/revamp/components/common/breadcrumb'
import FaqSection from '~/components/revamp/components/common/faqSection'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import SingleTabCardListing from '~/components/revamp/components/common/TabListing/singleTabCardListing'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import StatisticsSection from '~/v2/sections/StatisticsSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import { getFeaturesList } from '~/lib/sanity.queries'
import CategoryFeatureTabsSection from '~/v2/sections/CategoryFeatureTabsSection'
import FeatureHero from '~/v2/sections/FeatureHero'
import FeatureTestimonialsSection from '~/v2/sections/FeatureTestimonialsSection'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import IntegrationsShowcaseSection from '~/v2/sections/IntegrationsShowcaseSection'
import StackCardTestimonial from '~/v2/sections/stackCardTestimonialSection'

interface DentalProps {
  pageData: any
  faq: any
  features: any[]
  articles: any[]
}

export default function Dental({ pageData, faq, features, articles }: DentalProps) {
  if (!pageData) {
    return null
  }

  // Transform API articles data to match GroupedCardsGrid format
  // Limit to only 3 articles
  const transformedArticles = articles.slice(0, 3).map((article) => {
    // Use contentType and capitalize it (e.g., "article" -> "Article")
    const contentTypeLabel = article.contentType 
      ? article.contentType.charAt(0).toUpperCase() + article.contentType.slice(1)
      : 'Article'
    const articleUrl = article.url || (article.slug ? `https://resources.voicestack.com/article/${article.slug}` : '#')
    
    // Combine contentType label and title in heading to match Figma design (label above title)
    const headingWithCategory = `<div class="flex flex-col gap-1"><p class="font-geist font-normal text-base leading-[24px] text-vs-green">${contentTypeLabel}</p><p class="font-geist font-medium text-xl leading-[28px] text-white">${article.title || ''}</p></div>`
    
    return {
      _key: article._id,
      heading: headingWithCategory,
      image: article.mainImage?.url
        ? {
            url: article.mainImage.url,
            altText: article.mainImage.altText || article.title || '',
            metadata: article.mainImage.metadata || {},
          }
        : null,
      link: {
        url: articleUrl,
      },
    }
  })

  return (
    <>
      <SimpleHead
        data={pageData?.seo}
      />
      {/* <div className='!max-w-[1240px] w-full m-auto !px-0'> */}
      <Breadcrumb breadCrumb={pageData?.breadCrumb} />
      {/* </div> */}
      <FeatureHero data={pageData['dental-hero']} type="feature" />

      {pageData['logos-listing']?.componentData && (
        <LogoListingV2
          data={pageData['logos-listing']?.componentData.blocksListingData}
        />
      )}

      {pageData['card-with-image'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image']?.genericListingComponent}
        />
      )}

      {pageData['stack-card-tab-testimonial']?.componentData?.refData ? (
        <StackCardTestimonial
          data={
            pageData['stack-card-tab-testimonial']?.componentData?.refData
              ?.tabsListingComponent
          }
        />
      ) : (
        <StackCardTestimonial
          data={pageData['stack-card-tab-testimonial']?.componentData}
        />
      )}
      <CategoryFeatureTabsSection
          features={features} 
          variant="carousel"
          sectionHeading={pageData['category-feature-tabs']?.componentData?.sectionHeading}
      />
      {pageData['card-with-image2'] && (
        <GroupedCardsGridSection
          data={pageData['card-with-image2']?.genericListingComponent}
        />
      )}
      <StatisticsSection />
      {pageData['integrations-listing']?.componentData && (
        <IntegrationsShowcaseSection
          data={pageData['integrations-listing']?.componentData}
          theme="dark"
        />
      )}
{/* 
      {transformedArticles && transformedArticles.length > 0 && (
        <GroupedCardsGridSection
          data={{
            items: transformedArticles,
            ctaListItems: [],
            columnCount: 3,
          }}
          theme="dark"
        />
      )} */}

      {faq && <FaqSection faqItems={faq} />}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
    const slug = region === 'en' ? 'dental' : `dental-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)
    const features = await getFeaturesList(getClient(), region)

    if (!pageData) {
      console.error(`pageData not found for ${slug}`)
    }
    const faqData =
      pageData?.faqData?.[0] || pageData?.faqReferenced?.[0] || null

    // Fetch articles from API
    let articles: any[] = []
    try {
      const apiUrl = 'https://resources.voicestack.com/api/content'
      const response = await fetch(apiUrl)
      if (response.ok) {
        const apiData = await response.json()
        if (apiData.success && apiData.data) {
          articles = apiData.data
        }
      }
    } catch (apiError) {
      console.error('Error fetching articles from API:', apiError)
      // Continue without articles if API fails
    }

    return {
      props: {
        pageData: pageData || null,
        region: region,
        faq: faqData,
        features: features || [],
        articles: articles || [],
      },
    }
  } catch (error) {
    console.error('Error fetching dental page:', error)
    return {
      props: {
        pageData: null,
        region: region,
        faq: null,
        features: [],
        articles: [],
      },
    }
  }
}
