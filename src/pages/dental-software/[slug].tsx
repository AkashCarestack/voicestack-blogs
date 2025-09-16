import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { dentalSoftwareQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import { PortableText } from '@portabletext/react'
import SimpleHead from '~/components/common/SimpleHead'
import Layout from '~/components/Layout'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'

interface DentalSoftwarePage {
  _id: string
  basicInfo: {
    title: string
    slug: { current: string }
    description: string
    icon: any
  }
  content: {
    mainContent: any[]
    sections: any[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  language: string
}

interface DentalSoftwarePageProps {
  page: DentalSoftwarePage
  allPages: DentalSoftwarePage[]
  currentLanguage: string
  comparisonTableData?: any
}

export default function DentalSoftwarePage({ page, allPages, currentLanguage, comparisonTableData }: DentalSoftwarePageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!page) {
    return <div>Page not found</div>
  }

  const isHomePage = page.basicInfo.slug.current === 'home'

  return (
    <Layout>
      <SimpleHead
        title={page.seo?.metaTitle || page.basicInfo.title}
        description={page.seo?.metaDescription || page.basicInfo.description}
      />

      {/* Hero Section */}
      {/* The heroSection field was removed from the interface, so this block is removed */}

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {page.basicInfo.title}
              </h1>
              {page.basicInfo.description && (
                <p className="text-xl text-gray-600">
                  {page.basicInfo.description}
                </p>
              )}
            </div>

            {/* Content */}
            {page.content && page.content.mainContent && page.content.mainContent.length > 0 && (
              <div className="prose prose-lg max-w-none mb-12">
                <PortableText value={page.content.mainContent} />
              </div>
            )}

            {/* Dynamic Content Sections from CMS */}
            {page.content?.sections && page.content.sections.length > 0 && (
              <div className="space-y-16 mb-12">
                {page.content.sections.map((section: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                    {section.title && (
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        {section.title}
                      </h3>
                    )}
                    {section.component && (
                      <DynamicComponentRenderer 
                        component={section.component}
                        slugData={{
                          slug: section.slug?.current,
                          title: section.title,
                          pageType: 'dentalSoftware',
                          language: currentLanguage,
                          sectionIndex: index,
                          comparisonTableData: comparisonTableData
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Navigation to other pages */}
            {!isHomePage && allPages.length > 1 && (
              <div className="mt-16 pt-8 border-t">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  More from Dental Software
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allPages
                    .filter(p => p.basicInfo.slug.current !== page.basicInfo.slug.current)
                    .map((otherPage) => (
                      <a
                        key={otherPage._id}
                        href={`/dental-software/${otherPage.basicInfo.slug.current}`}
                        className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {otherPage.basicInfo.title}
                        </h4>
                        {otherPage.basicInfo.description && (
                          <p className="text-gray-600 text-sm">
                            {otherPage.basicInfo.description}
                          </p>
                        )}
                      </a>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Get all language variants
  const languages = ['en', 'en-GB', 'en-AU']
  const paths: any[] = []
  const client = getClient()

  for (const language of languages) {
    // Get all slugs for this language
    const slugs = await client.fetch(dentalSoftwareQueries.getDentalSoftwareSlugs, { language })
    
    // Add other page paths
    for (const slugData of slugs) {
      if (slugData.basicInfo.slug.current !== 'landing') {
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

  return {
    paths,
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string
  const currentLanguage = locale || 'en'
  const client = getClient()

  // Handle landing page - don't redirect during build
  if (slug === 'landing') {
    // First try to get the actual landing page
    let page = await client.fetch(dentalSoftwareQueries.getDentalSoftwarePageBySlug, {
      slug: 'landing',
      language: currentLanguage
    })
    
    // If no landing page exists, create one from existing data
    if (!page) {
      console.log('No dental software landing page found, creating from existing data')
      const existingPage = await client.fetch(dentalSoftwareQueries.createLandingPageFromExisting, {
        language: currentLanguage
      })
      
      if (existingPage) {
        // Transform existing page into landing page format
        page = {
          ...existingPage,
          basicInfo: {
            ...existingPage.basicInfo,
            title: 'Dental Software Solutions',
            slug: { _type: 'slug', current: 'landing' },
            description: 'Comprehensive dental software solutions for modern practices.'
          },
          content: existingPage.content || {
            mainContent: [
              {
                _type: 'block',
                children: [
                  {
                    _type: 'span',
                    text: 'Discover our comprehensive dental software solutions designed to streamline your practice operations and improve patient care.'
                  }
                ]
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
    
    const allPages = await client.fetch(dentalSoftwareQueries.getAllDentalSoftwarePages, {
      language: currentLanguage
    })

    // Get comparison table data for CustomComponent - use the same ID as other pages
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
        page,
        allPages: allPages || [],
        currentLanguage,
        comparisonTableData: comparisonTableData || null
      },
      revalidate: 60
    }
  }

  try {
    // Get the specific page
    const page = await client.fetch(dentalSoftwareQueries.getDentalSoftwarePageBySlug, {
      slug,
      language: currentLanguage
    })

    // Get all pages for navigation
    const allPages = await client.fetch(dentalSoftwareQueries.getAllDentalSoftwarePages, {
      language: currentLanguage
    })

    // Get comparison table data for CustomComponent - use the same ID as other pages
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

    if (!page) {
      return {
        notFound: true
      }
      }

    return {
      props: {
        page,
        allPages,
        currentLanguage,
        comparisonTableData: comparisonTableData || null
      },
      revalidate: 60 // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching Dental Software page:', error)
    return {
      notFound: true
    }
  }
}
