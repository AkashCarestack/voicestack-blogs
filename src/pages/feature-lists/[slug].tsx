import { GetStaticProps, GetStaticPaths } from 'next'
import { getClient } from '~/lib/sanity.client'
import { getFeatureListBySlug, getFeatureListSlugs } from '~/lib/sanity.queries'
import FeatureListDisplay from '~/components/features/FeatureListDisplay'
import SimpleHead from '~/components/common/SimpleHead'

interface FeatureListPageProps {
  featureList: any
  currentLanguage: string
}

export default function FeatureListPage({ featureList, currentLanguage }: FeatureListPageProps) {
  if (!featureList) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Feature List Not Found</h1>
          <p className="text-gray-600">The requested feature list could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SimpleHead
        title={featureList.metaTitle || `${featureList.title} - VoiceStack`}
        description={featureList.metaDescription || featureList.description}
        keywords={featureList.keywords}
      />
      
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <FeatureListDisplay
            title={featureList.title}
            description={featureList.description}
            features={featureList.features || []}
            displaySettings={featureList.displaySettings}
            className="max-w-7xl mx-auto"
          />
        </div>
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales = ['en'] }) => {
  const client = getClient()
  const paths: any[] = []

  for (const locale of locales) {
    try {
      const slugs = await getFeatureListSlugs(client, locale)
      
      paths.push(
        ...slugs.map((item: any) => ({
          params: { slug: item.slug.current },
          locale
        }))
      )
    } catch (error) {
      console.error(`Error fetching feature list slugs for locale ${locale}:`, error)
    }
  }

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()

  try {
    const featureList = await getFeatureListBySlug(
      client,
      params?.slug as string,
      currentLanguage
    )

    if (!featureList) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        featureList,
        currentLanguage
      },
      revalidate: 60 // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching feature list:', error)
    return {
      notFound: true
    }
  }
}
