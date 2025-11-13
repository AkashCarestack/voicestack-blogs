import React from 'react'
import { GetStaticProps } from 'next'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import AboutCompany from '~/components/revamp/components/common/AboutCompany'
import MinimalCardList from '~/components/revamp/components/common/minimalCardList'
import HeroSection from '~/components/revamp/components/common/HeroSection/heroSection'
import Queries from '~/components/revamp/queries'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import VoicestackLogo from 'public/assets/voicestack-logo.svg'
import bg2 from 'public/background/upscalemedia-transformed-2.png'
import bg3 from 'public/background/upscalemedia-transformed-3.png'



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
      <div
        className="pt-lg pb-md"
        style={{
          background:
            'linear-gradient(270deg, #CAC5FF 0%, #F2F1FA 51.44%, #F0EFFA 100%)',
        }}
      >
        {companyLandingData && (() => {
          // Find the hero section - try common patterns
          const heroKey = Object.keys(companyLandingData).find(
            (key) => key.includes('hero') && companyLandingData[key]?.componentData
          )
          const heroData =  pageData["company-hero"]?.componentData 
          
          return heroData ? (
            <HeroSection
              page=""
              showFullDescription={false}
              data={heroData}
            />
          ) : null
        })()}
      </div>
      {/* <AboutCompany heading={heading} description={description} image={image} icon={icon} /> */}
      <Section className="bg-white">
        <Container className="flex flex-col px-4 md:px-0">
      
         <Image 
           src={VoicestackLogo} 
           className='mt-8 md:mt-16' 
           width={199} 
           height={24} 
           alt="VoiceStack" 
           title="VoiceStack"
         />
          {pageData.description && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 py-6 md:py-8">
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
          <div className='flex flex-col md:flex-row gap-4 md:gap-6 py-8 md:py-16'>
            {data?.leaderShipTeam && (
              <div className="flex-1">
                <MinimalCardList data={data.leaderShipTeam} />
              </div>
            )}
            {data?.partners && (
              <div className="flex-1">
                <MinimalCardList data={data.partners} />
              </div>
            )}
          </div>
          {items && items.length > 0 && (
            <div className="md:before:p-16 p-8 rounded-[20px] md:my-16 my-8 relative w-full bg-gray-50 overflow-hidden">
              {/* Background images positioned absolutely */}
              <div 
                className="md:block hidden absolute left-0 top-0 w-[300px] h-[300px] md:w-[700px] md:h-[400px]"
                style={{ 
                  backgroundImage: `url(${bg2.src})`, 
                  backgroundSize: 'contain', 
                  backgroundPosition: 'left top',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              <div 
                className="md:block hidden absolute right-0 top-0 w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
                style={{ 
                  backgroundImage: `url(${bg3.src})`, 
                  backgroundSize: 'contain', 
                  backgroundPosition: 'right top',
                  backgroundRepeat: 'no-repeat'
                }}
              />
              
              {/* Content */}
              <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
                <h4 className="text-center font-manrope text-2xl md:text-4xl font-bold leading-[120%] mb-2 text-gray-950s">Our Impact</h4>
                <div className="grid md:grid-cols-2 gap-[24px] justify-items-center">
                  {items.map((item: any, index: number) => {
                    const headingText = item.heading?.replace(/<[^>]*>/g, '').trim() || ''
                    const isPurple = headingText.includes('$') || headingText.includes('2500+') || headingText.includes('145M')
                    
                    return (
                      <div
                        key={item._key || index}
                        className="bg-white rounded-[20px] border border-[#D1D5DB] p-6 md:p-8 flex flex-col items-center justify-center min-h-[140px] max-w-[325px] w-full"
                        style={{
                          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.10)'
                        }}
                      >
                        <div 
                          className={`text-center font-manrope text-2xl md:text-4xl font-bold leading-[120%] mb-2 ${isPurple ? 'text-[#4A3CE1]' : 'text-gray-950'}`}
                          dangerouslySetInnerHTML={{ __html: item.heading }}
                        />
                        <span className="text-[#000] text-center font-inter text-base font-normal leading-[160%]">
                          {item.subheading}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
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
          'Meet the founders and leaders changing the dental software industry one practice at a time.',
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
        companyLandingData: companyLandingData || null,
      },
    }
  } catch (error) {
    console.error('Error fetching Company page data:', error)
    return {
      notFound: true,
    }
  }
}
