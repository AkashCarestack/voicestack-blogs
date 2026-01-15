import React from 'react'
import { GetStaticProps } from 'next'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import AboutCompany from '~/components/revamp/components/common/AboutCompany'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import Queries from '~/components/revamp/queries'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import VoicestackLogo from 'public/assets/voicestack-logo.svg'
import bg2 from 'public/background/upscalemedia-transformed-2.png'
import bg3 from 'public/background/upscalemedia-transformed-3.png'
import SimpleHead from '~/components/common/SimpleHead'
import HeroWrapper from '~/components/revamp/components/common/HeroWrapper'
import FeatureHero from '~/v2/sections/FeatureHero'
import CardsGridSection from '~/v2/sections/CardsGridSection'
import SectionHeaderV2 from '~/v2/components/common/sectionHeaderV2'
import GroupedCardsGridSection from '~/v2/sections/GroupedCardsGridSection'
import MinimalCardList from '~/v2/components/common/minimalCardList'
import GroupedCardsGrid from '~/v2/components/GroupedCardsGrid'



interface CompanyPageProps {
  pageData: any
  region: string
  metaTitle?: string | null
  metaDescription?: string | null
  data: any
  companyLandingData: any
}

export default function CompanyPage({
  pageData,
  region,
  metaTitle,
  metaDescription,
  data,
  companyLandingData,
}: CompanyPageProps) {
  const items = pageData["our-impact"]?.componentData?.items;


  return (
    <>
      <SimpleHead data={pageData?.seo} />
     
      <FeatureHero
        data={pageData["company-hero"]?.componentData}
      />
      {/* <AboutCompany heading={heading} description={description} image={image} icon={icon} /> */}
      <Section className="bg-white">
        <Container className="flex flex-col px-6 md:px-12  py-sm md:py-md" type="V2" border="y-0">
          <SectionHeaderV2 heading="Our Story" isLeftAlign={true}/>
      
         {/* <Image 
           src={VoicestackLogo} 
           className='mt-8 md:mt-16' 
           width={199} 
           height={24} 
           alt="VoiceStack" 
           title="VoiceStack"
         /> */}
          {pageData.description && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 py-6 md:py-8 ">
              <div className="flex flex-col gap-4 md:gap-6 text-left">
                <PortableText 
                  value={Array.isArray(pageData.description) 
                    ? pageData.description.slice(0, Math.ceil(pageData.description.length / 2))
                    : pageData.description
                  }
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="text-gray-700 text-base md:text-lg leading-[155.55%]">
                          {children}
                        </p>
                      ),
                    },
                    marks: {
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                    },
                  }}
                />
              </div>
              <div className="flex flex-col gap-4 md:gap-6 text-left">
                <PortableText 
                  value={Array.isArray(pageData.description) 
                    ? pageData.description.slice(Math.ceil(pageData.description.length / 2))
                    : []
                  }
                  components={{
                    block: {
                      normal: ({ children }) => (
                        <p className="text-gray-700 text-base md:text-lg leading-[155.55%]">
                          {children}
                        </p>
                      ),
                    },
                    marks: {
                      strong: ({ children }) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                    },
                  }}
                />
              </div>
            </div>
          )}
       
       <div className='border-x border-gray-200'>
          <GroupedCardsGrid 
            customListingItems={[
              {
                heading: data?.leaderShipTeam?.title,
                description: data?.leaderShipTeam?.description,
                link: { url: data?.leaderShipTeam?.cta?.buttonLink },
              },
              // {
              //   heading: data?.partners?.title,
              //   description: data?.partners?.description,
              //   link: { url: data?.partners?.cta?.buttonLink },
              // },
            ]} 
            theme={'light'} 
            simpleListingData={true}
            columnCount={2}
            showBorderBottom={true}
          />

       </div>
        </Container>
      </Section>
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  try {
    const region = locale || 'en'
    const queries = new Queries('company', region)
    const slug = region === 'en' ? 'landing' : `landing-${region.toLowerCase()}`

    const pageData = await queries.getPageData('company', slug)

    if (!pageData || Object.keys(pageData).length === 0) {
      return {
        notFound: true,
      }
    }

    // Fetch company landing page data for hero section
    const companyLandingSlug = region === 'en' ? 'company-landing' : `company-landing-${region.toLowerCase()}`
    const companyLandingData = await queries.getPageData('company', companyLandingSlug)

    // Fallback data structure (can be removed once data is in Sanity)
    const data = {
      title: 'Company',
      leaderShipTeam: {
        title: 'Leadership Team',
        description:
          'Meet the founders and leaders changing the healthcare software industry one practice at a time.',
        cta: {
          buttonText: 'Learn More',
          buttonLink: '/company/leadership-team',
        },
      },
      partners: {
        title: 'Partners',
        description:
          'Strategic partners include leading innovators from across the dental & healthcare industries.',
        cta: {
          buttonText: 'Learn More',
          buttonLink: '/company/partners',
        },
      },
    }

    return {
      props: {
        pageData,
        region,
        metaTitle: pageData?.metaTitle || null,
        metaDescription: pageData?.metaDescription || null,
        data: data,
        companyLandingData: JSON.parse(JSON.stringify(companyLandingData ?? null))
      },
    }
  } catch (error) {
    console.error('Error fetching Company page data:', error)
    return {
      notFound: true,
    }
  }
}
