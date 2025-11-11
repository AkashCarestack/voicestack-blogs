import React from 'react'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import Container from '~/components/structure/Container'
import Section from '~/components/structure/Section'
import Queries from '~/components/revamp/queries'
import Link from 'next/link'

interface CompanyPageProps {
  pageData: any
  region: string
  metaTitle?: string | null
  metaDescription?: string | null
  data: any
}
const MinimalCardList = ({ data }: { data: any }) => {
  return (
    <div className="flex flex-col gap-3 bg-white md:py-8 py-4 md:px-6 px-2 rounded-[24px]">
      <h4 className="md:text-2xl text-xl font-bold text-gray-950 leading-[133.33%] font-manrope">
        {data?.title}
      </h4>
      <p className="md:text-base text-sm font-normal leading-[150%] text-gray-700">
        {data?.description}
      </p>
      {data?.cta && (
        <Link href={data.cta.buttonLink}>{data.cta.buttonText}</Link>
      )}
    </div>
  )
}

export default function CompanyPage({ data }: CompanyPageProps) {
  console.log('data', data)
  return (
    <>
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
