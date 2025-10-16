import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { dentalPhonesQueries } from '~/lib/sanity.queries'
import Queries from '~/components/revamp/queries'
import SimpleHead from '~/components/common/SimpleHead'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'
import FeaturesSectionWithNavigation from '~/components/FeaturesSectionWithNavigation'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'

interface DentalPhonesPage {
  _id: string
  basicInfo: {
    title: string
    slug: { current: string }
    description: string
    icon: any
  }
  content: {
    sections: any[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  language: string
}

interface DentalPhonesPageProps {
  page: DentalPhonesPage
  allPages: DentalPhonesPage[]
  currentLanguage: string
  integrations?: any[]
}

export default function DentalPhonesPage({ page, allPages, currentLanguage, integrations }: DentalPhonesPageProps) {
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

      {/* Dynamic Content Sections */}
      {page.content && page.content.sections && page.content.sections.length > 0 ? (
        <div>
          {page.content.sections.map((section: any, index: number) => {
            // Debug logging
            if (process.env.NODE_ENV === 'development') {
              console.log(`Section ${index} Debug:`, {
                section,
                hasComponent: !!section.component,
                componentType: section.component?.componentType,
                slug: section.slug?.current
              })
            }
            
            return (
              <div key={index}>
                {section.component ? (
                  <DynamicComponentRenderer 
                    component={section.component}
                    slugData={{
                      slug: section.slug?.current,
                      title: section.title,
                      pageType: 'whoWeServe',
                      language: currentLanguage,
                      sectionIndex: index
                    }}
                  />
                ) : (
                  <div className="py-8 bg-yellow-50 border border-yellow-200 rounded-lg mx-4">
                    <p className="text-yellow-800 text-center">
                      <strong>Section {index + 1}:</strong> No component data found
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Content Sections</h2>
              <p className="text-gray-600">
                This page doesn&apos;t have any content sections configured in the CMS.
              </p>
            </div>
          </div>
        </div>
      )}

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

      {(page.basicInfo.slug.current === 'integrations' || page.basicInfo.slug.current === 'Integrations') && (
        <IntegrationsGrid 
          integrations={integrations}
        />
      )}

      {/* Add FeaturesSectionWithNavigation for integrations page */}
      {(page.basicInfo.slug.current === 'integrations' || page.basicInfo.slug.current === 'Integrations') && (
        <FeaturesSectionWithNavigation />
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
      const slugs = await client.fetch(dentalPhonesQueries.getDentalPhonesSlugs, { language })
      console.log(`Found slugs for ${language}:`, slugs)
      
      for (const slugData of slugs) {
        if (slugData.basicInfo && slugData.basicInfo.slug && slugData.basicInfo.slug.current) {
          const slug = slugData.basicInfo.slug.current
          paths.push({
            params: { slug: slug },
            locale: language === 'en' ? 'en' : language
          })
          // Also add capitalized version for common slugs
          if (slug === 'integrations') {
            paths.push({
              params: { slug: 'Integrations' },
              locale: language === 'en' ? 'en' : language
            })
          }
        }
      }
      
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

  // Handle landing page - don't redirect during build
  if (slug === 'landing') {
    const client = getClient()
    
    // First try to get the actual landing page
    let page = await client.fetch(dentalPhonesQueries.getDentalPhonesPageBySlug, {
      slug: 'landing',
      language: currentLanguage
    })
    
    // If no landing page exists, create one from existing data
    if (!page) {
      console.log('No landing page found, creating from existing data')
      const existingPage = await client.fetch(dentalPhonesQueries.createDentalPhonesLandingFromExisting, {
        language: currentLanguage
      })
      
      if (existingPage) {
        // Transform existing page into landing page format
        page = {
          ...existingPage,
          basicInfo: {
            ...existingPage.basicInfo,
            title: 'Dental Phone Systems',
            slug: { _type: 'slug', current: 'landing' },
            description: 'Discover our comprehensive dental phone system solutions for modern practices.'
          },
          content: existingPage.content || {
            sections: [
              {
                title: 'Our Featured Solutions',
                slug: { _type: 'slug', current: 'heroGrid' },
                component: {
                  componentType: 'Listing',
                  listingComponent: {
                    title: 'Industries We Serve',
                    description: 'We provide tailored solutions for various industries and organization types.',
                    items: [
                      {
                        title: 'Dental Practices',
                        description: 'Comprehensive dental practice management solutions',
                        icon: null
                      },
                      {
                        title: 'Healthcare Organizations',
                        description: 'Advanced healthcare communication systems',
                        icon: null
                      },
                      {
                        title: 'Small Businesses',
                        description: 'Scalable solutions for growing businesses',
                        icon: null
                      }
                    ],
                    layout: 'grid'
                  }
                }
              }
            ]
          }
        }
      }
    }
    
    if (!page) {
      return {
        notFound: true
      }
    }
    
    const allPages = await client.fetch(dentalPhonesQueries.getAllDentalPhonesPages, {
      language: currentLanguage
    })
    
    return {
      props: {
        page,
        allPages: allPages || [],
        currentLanguage
      },
      revalidate: 60
    }
  }

  try {
    const client = getClient()

    // Get the specific page - try both original slug and lowercase version
    let page = await client.fetch(dentalPhonesQueries.getDentalPhonesPageBySlug, {
      slug,
      language: currentLanguage
    })

    // If not found, try lowercase version
    if (!page && slug !== slug.toLowerCase()) {
      page = await client.fetch(dentalPhonesQueries.getDentalPhonesPageBySlug, {
        slug: slug.toLowerCase(),
        language: currentLanguage
      })
    }

    console.log('Fetched page:', page)
    console.log('Page content sections:', page?.content?.sections)
    console.log('Page content sections length:', page?.content?.sections?.length)

    // Get all pages for navigation
    const allPages = await client.fetch(dentalPhonesQueries.getAllDentalPhonesPages, {
      language: currentLanguage
    })

    // Get complete integrations data for integrations page
    let integrations: any[] = []
    if (slug === 'integrations' || slug === 'Integrations') {
      try {
        console.log('Fetching integrations for slug:', slug, 'language:', currentLanguage)
        
        // Use revamp queries for cleaner code
        const queries = new Queries(slug, currentLanguage)
        integrations = await queries.fetchCompleteIntegrationsData(currentLanguage)
        
        console.log('Revamp queries result:', integrations)
        console.log('Revamp queries count:', integrations.length)
        
      } catch (error) {
        console.error('Error fetching integrations data:', error)
        integrations = []
      }
    }

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
        currentLanguage,
        integrations: integrations || []
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
