import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { whoWeServeQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import Layout from '~/components/Layout'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'

interface WhoWeServePage {
  _id: string
  basicInfo: {
    title: string
    slug: { current: string }
    description: string
    icon: any
  }
  content?: {
    mainContent: any[]
    sections: any[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  language: string
}

interface WhoWeServeIndexProps {
  pages: WhoWeServePage[]
  currentLanguage: string
  homePage?: WhoWeServePage
  comparisonTableData?: any
}

export default function WhoWeServeIndex({ pages, currentLanguage, homePage, comparisonTableData }: WhoWeServeIndexProps) {
  return (
    <Layout>
    <SimpleHead
        title="Who We Serve"
        description="Discover how our solutions serve different segments of the dental industry"
      />

      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Who We Serve
            </h1>
            <p className="text-xl opacity-90">
              Discover how our solutions serve different segments of the dental industry
            </p>
          </div>
        </div>
      </section>

    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()

  try {
    // Get all pages
    const pages = await client.fetch(whoWeServeQueries.getAllWhoWeServePages, {
      language: currentLanguage
    })

    // Get home page if it exists
    const homePage = pages.find((page: WhoWeServePage) => page.basicInfo?.slug?.current === 'landing')

    // Get comparison table data for CustomComponent - use the same ID as DENTAL PRACTICES page
    const comparisonTableData = await client.fetch(`
      *[_id == "85f555da-0aba-406c-812c-1ef3e652d099"][0] {
        _id,
        title,
        comparisonTable {
          title,
          columns[] {
            _key,
            _type,
            header,
            highlighted
          },
          rows[] {
            _key,
            _type,
            feature,
            values[] {
              _key,
              _type,
              text,
              value
            }
          }
        },
        dataType
      }
    `)

    return {
      props: {
        pages,
        currentLanguage,
        homePage: homePage || null,
        comparisonTableData: comparisonTableData || null
      },
      revalidate: 60 // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching Who We Serve pages:', error)
    return {
      props: {
        pages: [],
        currentLanguage,
        homePage: null
      }
    }
  }
}
