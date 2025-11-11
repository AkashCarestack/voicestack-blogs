import React from 'react'
import { GetStaticProps } from 'next'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import MinimalCardList from '../../components/revamp/components/common/minimalCardList'
import AboutCompany from '~/components/revamp/components/common/AboutCompany'

interface CompanyPageProps {
  pageData: any
  region: string
  metaTitle?: string | null
  metaDescription?: string | null
  data: any
}


export default function CompanyPage({ data }: CompanyPageProps) {
  console.log('data', data)
  return (
    <>
      <AboutCompany />
      <Section className="py-sm md:py-md lg:py-lg ">
        <Container className="md:flex-row flex-col gap-6">
          {data?.leaderShipTeam && (
            <div className='flex flex-row gap-3'><MinimalCardList data={data.leaderShipTeam} /> </div>
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
    const region = locale || 'en'




    return {
      props: {
        data :data,
        region: region,
      },
    }
  } catch (error) {
    console.error('Error fetching Company page data:', error)
    return {
      notFound: true,
    }
  }
}
