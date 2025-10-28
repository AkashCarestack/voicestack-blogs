import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { dentalPhonesQueries } from '~/lib/sanity.queries'
import Queries from '~/components/revamp/queries'
import SimpleHead from '~/components/common/SimpleHead'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'
import FeaturesSectionWithNavigation from '~/components/FeaturesSectionWithNavigation'

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

interface IntegrationCategory {
  _id: string
  name: string
  subheading?: string
  description?: string
  mainImage?: any
  icon?: any
  iconSvgCode?: string
  language: string
}

interface IntegrationList {
  _id: string
  title: string
  headline: string
  description?: any
  shortDescription?: string
  image?: any
  link?: string
  integrationCategory?: IntegrationCategory
  language: string
}

interface IntegrationData {
  categories: IntegrationCategory[]
  integrations: IntegrationList[]
}

interface DentalPhonesPageProps {
  page: DentalPhonesPage
  allPages: DentalPhonesPage[]
  currentLanguage: string
  integrations?: any[]
  integrationData?: IntegrationData
}

export default function DentalPhonesPage({ page, allPages, currentLanguage, integrations, integrationData }: DentalPhonesPageProps) {
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

      {page.content && page.content.sections && page.content.sections.length > 0 ? (
        <div>
          {page.content.sections.map((section: any, index: number) => {
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


      {/* Add FeaturesSectionWithNavigation for integrations page */}
      { integrationData && (
        <FeaturesSectionWithNavigation 
          categories={integrationData.categories}
          integrations={integrationData.integrations}
        />
      )}
    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const client = getClient()
    const languages = ['en', 'en-GB', 'en-AU']
    const paths: any[] = []

    for (const language of languages) {
      // Get all slugs for this language
      const slugs = await client.fetch(dentalPhonesQueries.getDentalPhonesSlugs, { language })
      
      for (const slugData of slugs) {
        if (slugData.basicInfo && slugData.basicInfo.slug && slugData.basicInfo.slug.current) {
          const slug = slugData.basicInfo.slug.current
          paths.push({
            params: { slug: slug },
            locale: language === 'en' ? 'en' : language
          })
          // Note: Removed duplicate capitalized version to prevent build conflicts
        }
      }
      
      paths.push({
        params: { slug: 'landing' },
        locale: language === 'en' ? 'en' : language
      })
    }

    return {
      paths,
      fallback: 'blocking'
    }
  } catch (error) {
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

    // Get all pages for navigation
    const allPages = await client.fetch(dentalPhonesQueries.getAllDentalPhonesPages, {
      language: currentLanguage
    })

    // Get complete integrations data for integrations page
    let integrations: any[] = []
    let integrationData: IntegrationData | undefined = undefined
    
    if (slug?.toLowerCase() === 'integrations') {
      try {
        
        // Use revamp queries for cleaner code
        const queries = new Queries(slug, currentLanguage)
        integrations = await queries.fetchCompleteIntegrationsData(currentLanguage)
        integrationData = await queries.fetchIntegrationData(currentLanguage)
        
      } catch (error) {
        integrations = []
        integrationData = undefined
      }
    }

    if (!page) {
      return {
        notFound: true
      }
    }

    return {
      props: {
        page,
        allPages: allPages || [],
        currentLanguage,
        integrations: integrations || [],
        integrationData: integrationData || null // Changed from undefined to null
      },
    }
  } catch (error) {
    return {
      notFound: true
    }
  }
}
