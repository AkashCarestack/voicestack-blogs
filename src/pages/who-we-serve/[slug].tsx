import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { whoWeServeQueries } from '~/lib/sanity.queries'
import SimpleHead from '~/components/common/SimpleHead'

interface WhoWeServePage {
  _id: string
  title: string
  slug: { current: string }
  description: string
  icon: any
  heroSection?: {
    heroTitle?: string
    heroSubtitle?: string
    heroImage?: any
    heroBackground?: any
  }
  content: any[]
  sections?: Array<{
    sectionTitle: string
    sectionContent: any[]
    sectionOrder: number
  }>
  metaTitle?: string
  metaDescription?: string
  order: number
  isPublished: boolean
  language: string
}

interface WhoWeServePageProps {
  page: WhoWeServePage
  allPages: WhoWeServePage[]
  currentLanguage: string
}

export default function WhoWeServePage({ page, allPages, currentLanguage }: WhoWeServePageProps) {
  const router = useRouter()

  console.log('Page props:', { page, allPages, currentLanguage })

  if (router.isFallback) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Page Not Found</h1>
          <p className="text-gray-600">The requested page could not be found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <SimpleHead
        title={page.metaTitle || page.title}
        description={page.metaDescription || page.description}
      />

      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-blue-600 mb-8 text-center">
          {page.title}
        </h1>

        {/* Debug Info */}
        <div className="bg-yellow-100 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">Debug Information</h2>
          <p className="text-yellow-700 mb-2">
            <strong>URL:</strong> {router.asPath}
          </p>
          <p className="text-yellow-700 mb-2">
            <strong>Language:</strong> {currentLanguage}
          </p>
          <p className="text-yellow-700">
            <strong>Page Found:</strong> Yes
          </p>
        </div>

        {/* Page Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Content</h2>
          
          {page.description && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
              <p className="text-gray-600">{page.description}</p>
            </div>
          )}

          {page.content && page.content.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Content Blocks</h3>
              <p className="text-gray-600">Content has {page.content.length} blocks</p>
            </div>
          )}

          {page.sections && page.sections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Sections</h3>
              <p className="text-gray-600">Page has {page.sections.length} sections</p>
            </div>
          )}
        </div>

        {/* Raw Data Display */}
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Raw Page Data</h2>
          <pre className="text-xs text-gray-700 bg-white p-4 rounded border overflow-auto max-h-96">
            {JSON.stringify(page, null, 2)}
          </pre>
        </div>

        {/* All Pages */}
        {allPages && allPages.length > 0 && (
          <div className="mt-8 bg-blue-50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-blue-800 mb-4">All Available Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allPages.map((otherPage) => (
                <div key={otherPage._id} className="bg-white p-4 rounded border">
                  <h3 className="font-semibold text-gray-800">{otherPage.title}</h3>
                  <p className="text-sm text-gray-600">/{otherPage.slug.current}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  console.log('getStaticPaths called')
  
  try {
    const client = getClient()
    const languages = ['en', 'en-GB', 'en-AU']
    const paths: any[] = []

    for (const language of languages) {
      console.log(`Fetching slugs for language: ${language}`)
      
      // Get all slugs for this language
      const slugs = await client.fetch(whoWeServeQueries.getWhoWeServeSlugs, { language })
      console.log(`Found slugs for ${language}:`, slugs)
      
      // Add all slugs as paths
      for (const slugData of slugs) {
        if (slugData.slug && slugData.slug.current) {
          paths.push({
            params: { slug: slugData.slug.current },
            locale: language === 'en' ? 'en' : language
          })
        }
      }
    }

    console.log('Final generated paths:', paths)
    return {
      paths,
      fallback: 'blocking'
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    // Return some basic paths as fallback
    return {
      paths: [
        { params: { slug: 'home' }, locale: 'en' }
      ],
      fallback: 'blocking'
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string
  const currentLanguage = locale || 'en'

  console.log('getStaticProps called with:', { slug, currentLanguage })

  try {
    const client = getClient()

    // Get the specific page
    const page = await client.fetch(whoWeServeQueries.getWhoWeServePageBySlug, {
      slug,
      language: currentLanguage
    })

    console.log('Fetched page:', page)

    // Get all pages for navigation
    const allPages = await client.fetch(whoWeServeQueries.getAllWhoWeServePages, {
      language: currentLanguage
    })

    console.log('Fetched all pages:', allPages)

    if (!page) {
      console.log('Page not found, returning 404')
      return {
        notFound: true
      }
    }

    return {
      props: {
        page,
        allPages: allPages || [],
        currentLanguage
      },
      revalidate: 60 // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching Who We Serve page:', error)
    return {
      notFound: true
    }
  }
}
