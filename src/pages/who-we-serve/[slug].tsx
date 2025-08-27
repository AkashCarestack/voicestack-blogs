import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { whoWeServeQueries } from '~/lib/sanity.queries'
import SimpleHead from '~/components/common/SimpleHead'

interface WhoWeServePage {
  _id: string
  basicInfo: {
    title: string
    slug: { current: string }
    description: string
    icon: any
  }
  content: {
    mainContent: any[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  language: string
}

interface WhoWeServePageProps {
  page: WhoWeServePage
  allPages: WhoWeServePage[]
  currentLanguage: string
}

export default function WhoWeServePage({ page, allPages, currentLanguage }: WhoWeServePageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!page) {
    return <div>Page not found</div>
  }

  return (
    <div>
      <SimpleHead
        title={page.basicInfo.title}
        description={page.basicInfo.description}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              {page.basicInfo.title}
            </h1>
            {page.basicInfo.description && (
              <p className="text-xl opacity-90">
                {page.basicInfo.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Description */}
            {page.basicInfo?.description && (
              <div className="text-center mb-12">
                <p className="text-xl text-gray-600">
                  {page.basicInfo.description}
                </p>
              </div>
            )}

            {/* Page Content */}
            {page.content && page.content.mainContent && page.content.mainContent.length > 0 && (
              <div className="prose prose-lg max-w-none">
                {/* You can add PortableText here to render the content */}
                <div className="text-gray-700">
                  {/* For now showing basic content - you can enhance this with PortableText */}
                  <p>{page.basicInfo?.description || 'No description available'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Navigation to other pages */}
      {allPages && allPages.length > 1 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Explore More Solutions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allPages
                  .filter((p) => p._id !== page._id && p.basicInfo)
                  .map((otherPage) => (
                    <a
                      key={otherPage._id}
                      href={`${currentLanguage !== 'en' ? `/${currentLanguage}` : ''}/who-we-serve/${otherPage.basicInfo?.slug?.current}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                        {otherPage.basicInfo?.icon && (
                          <div className="w-16 h-16 mx-auto mb-4">
                            <img
                              src={otherPage.basicInfo.icon}
                              alt={otherPage.basicInfo?.title || 'Page'}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {otherPage.basicInfo?.title || 'Untitled'}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {otherPage.basicInfo?.description || 'No description available'}
                        </p>
                      </div>
                    </a>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}
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
        if (slugData.basicInfo && slugData.basicInfo.slug && slugData.basicInfo.slug.current) {
          paths.push({
            params: { slug: slugData.basicInfo.slug.current },
            locale: language === 'en' ? 'en' : language
          })
        }
      }
      
      // Add landing page path for redirect
      paths.push({
        params: { slug: 'landing' },
        locale: language === 'en' ? 'en' : language
      })
    }

    console.log('Final generated paths:', paths)
    return {
      paths,
      fallback: 'blocking'
    }
  } catch (error) {
    console.error('Error in getStaticPaths:', error)
    // Return empty paths as fallback
    return {
      paths: [],
      fallback: 'blocking'
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string
  const currentLanguage = locale || 'en'

  console.log('getStaticProps called with:', { slug, currentLanguage })

  // Redirect landing page to main who-we-serve page
  if (slug === 'landing') {
    return {
      redirect: {
        destination: '/who-we-serve',
        permanent: false,
      },
    }
  }

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
