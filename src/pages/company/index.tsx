import React from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import AboutCompany from '~/components/revamp/components/common/AboutCompany'
import MinimalCardList from '~/components/revamp/components/common/minimalCardList'
import Queries from '~/components/revamp/queries'

interface CompanyPageProps {
  pageData: any
  region: string
  metaTitle?: string | null
  metaDescription?: string | null
  data: any
}

export default function CompanyPage({
  pageData,
  region,
  metaTitle,
  metaDescription,
  data,
}: CompanyPageProps) {
    console.log({pageData})
    const heading = pageData["about-voicestack"].componentData.heading
    const description = pageData["about-voicestack"].componentData.description
  return (
    <>
      <Head>
        <title>{metaTitle || 'Company | VoiceStack'}</title>
        {metaDescription && (
          <meta name="description" content={metaDescription} />
        )}
      </Head>
      <AboutCompany heading={heading} description={description} />
      <Section className="py-sm md:py-md lg:py-lg ">
        <Container className="md:flex-row flex-col gap-6">
          {data?.leaderShipTeam && (
            <div className="flex flex-row gap-3">
              <MinimalCardList data={data.leaderShipTeam} />
            </div>
          )}
          {data?.partners && <MinimalCardList data={data.partners} />}
          {/* Add your page content here */}
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
      },
    }
  } catch (error) {
    console.error('Error fetching Company page data:', error)
    return {
      notFound: true,
    }
  }
}
