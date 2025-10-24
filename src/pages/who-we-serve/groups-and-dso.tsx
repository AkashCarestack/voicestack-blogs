import React from 'react'
import { GetStaticProps } from 'next'
import Queries from '~/components/revamp/queries'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'

interface GroupsAndDSOProps {
  pageData: any
}

export default function GroupsAndDSO({ pageData }: GroupsAndDSOProps) {
  const data = pageData?.['groups-and-dso']?.componentData
  console.log({data})
  return data ? <TabCardsListing data={data} /> :<></>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    const queries = new Queries('whoWeServe', region)
   
    const slug =
      region === 'en'
        ? 'groups-and-dso'
        : `groups-and-dso-${region.toLowerCase()}`
        console.log({slug})
    const pageData = await queries.getPageData('whoWeServe', slug)

    return {
      props: {
        pageData: pageData || null,
        currentLanguage: region,
      },
    }
  } catch (error) {
    console.error('Error fetching groups and DSO page:', error)
    return {
      props: {
        pageData: null,
        currentLanguage: region,
      },
    }
  }
}
