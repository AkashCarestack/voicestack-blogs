import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { whoWeServeQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import Layout from '~/components/Layout'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'
import Queries from '~/components/revamp/queries'
import TabCardsListing from '~/components/revamp/components/common/TabListing/tabCardsListing'

export default function WhoWeServeIndex({ pages }: any) {
  const data = pages?.['groups-and-dso']?.componentData
  return data ? <TabCardsListing data={data} /> : <></>
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const region = locale || 'en'

  try {
    // Get all pages
    const queries = new Queries('whoWeServe', region)
    const slug =
      region === 'en'
        ? 'groups-and-dso'
        : `groups-and-dso-${region.toLowerCase()}`
    const pageData = await queries.getPageData('whoWeServe', slug)

    return {
      props: {
        pages: pageData,
        currentLanguage: region,
      },
      revalidate: 60, // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching Who We Serve pages:', error)
    return {
      props: {
        pages: [],
      },
    }
  }
}
