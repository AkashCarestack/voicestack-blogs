import React from 'react'
import { GetStaticProps } from 'next'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import CardsGridSection from '~/components/revamp/components/CardsGridSection'
import ComparisonCardsSection from '~/components/revamp/components/ComparisonCardsSection'
import Queries from '~/components/revamp/queries'
import { getClient } from '~/lib/sanity.client'
import {
    getFeaturesList,
} from '~/lib/sanity.queries'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'
import StackCardTestimonial from '~/components/revamp/components/common/stackCardTestimonial/stackCardTestimonial'
import VerticalTestimonialListing from '~/components/revamp/components/common/VerticalTestimonialListing/VerticalTestimonialListing'
import FaqSection from '~/components/revamp/components/common/faqSection'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'
import CardListing from '~/components/revamp/components/cardListing'
import CardsWithSvg from '~/components/revamp/components/common/cardsWithSvg'

// Define proper TypeScript interfaces
interface HeroComponentData {
    title?: string
    subtitle?: string
    description?: string
    backgroundImage?: string
    [key: string]: any // For flexibility with dynamic data
}

interface GenericListingData {
    heading?: string
    description?: string
    items?: Array<{
        _key?: string
        heading?: string
        subheading?: string
        description?: string
        link?: {
            url?: string
            text?: string
            buttonType?: string
        }
        dynamicSvg?: string
        image?: any
    }>
}

interface PageData {
    'ai-receptionist-hero'?: {
        componentData: HeroComponentData
    }
    [key: string]: any // For other page sections
}

interface AiReceptionistProps {
    pageData: PageData
    region: string
    faq: any
    features: any[]
}

export default function AiReceptionist({
    pageData,
    faq,
    features,
}: AiReceptionistProps) {
    console.log({pageData})
    return (
        <>
            <div
                className="bg-gradient-to-r from-[#CAC5FF] via-[#F2F1FA] to-[#F0EFFA]"
                style={{
                    background: 'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)'
                }}
            >
                <HeroSection refer={pageData['dental-phones-hero']} data={pageData['dental-phones-hero']?.componentData} page="why-voicestack" />
            </div>
            { 
                pageData['ai-features']?.componentData && (
                    <CardsWithSvg data={pageData['ai-features']} />
                )
            }


            {/* <CategoryFeatureTabs features={features} /> */}
            {
                pageData['real-business-outcomes']?.componentData?.refData?.tabsListingComponent && (
                    <CardListing 
                        data={pageData["real-business-outcomes"]?.componentData?.refData?.tabsListingComponent}
                    />
                )
            }

            {pageData['how-voicestack-works']?.componentData && (
                <CardsGridSection
                    data={pageData['how-voicestack-works']?.componentData}
                />
            )}
            {console.log(pageData['grow-your-practice']?.componentData)}
            {pageData['grow-your-practice']?.componentData && (
                <StackCardTestimonial
                    data={pageData['grow-your-practice']?.componentData}
                />
            )}


            {/* FAQ Section */}
            {faq && faq.faqCategories && faq.faqCategories.length > 0 && (
                <div>
                    <FaqSection faqItems={faq} />
                </div>
            )}
        </>
    )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
    try {
        const region = locale || 'en'
        const queries = new Queries('ai-receptionist', region)
        const slug = region === 'en' ? 'ai-receptionist' : `ai-receptionist-${region.toLowerCase()}`
        const pageData = await queries.getPageData('aiReceptionist', slug) || []
         const heroData = pageData?.['why-voicestack-hero']?.componentData || null
        

        if (!pageData || Object.keys(pageData).length === 0) {
            return {
                notFound: true,
            }
        }

        let faqData = null
        if (pageData?.faqData && Array.isArray(pageData.faqData) && pageData.faqData.length > 0) {
            faqData = pageData.faqData[0]
        } else if (pageData?.faqReferenced && Array.isArray(pageData.faqReferenced) && pageData.faqReferenced.length > 0) {
            faqData = pageData.faqReferenced[0]
        }


        return {
            props: {
                pageData,
                region,
                faq: faqData,
                heroData: heroData,
            },

        }
    } catch (error) {
        console.error('Error fetching AI Receptionist page data:', error)
        return {
            notFound: true,
        }
    }
}
