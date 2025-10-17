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
  globalData?: any[]
}

export default function WhoWeServeIndex({ pages, currentLanguage, homePage, comparisonTableData, globalData }: WhoWeServeIndexProps) {
  return (
    <div>
      <SimpleHead
        title="Who We Serve"
        description="Discover how our solutions serve different segments of the dental industry"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Who We Serve Index
            </h1>
            <p className="text-xl opacity-90">
              Discover how our solutions serve different segments of the dental industry
            </p>
          </div>
        </div>
      </section>

      {/* Landing Page Content - Display CMS content if available */}
      {homePage && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                {homePage.basicInfo?.title || 'Who We Serve'}
              </h2>
              {homePage.basicInfo?.description && (
                <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                  {homePage.basicInfo.description}
                </p>
              )}
              
              {/* Dynamic Content Sections from CMS */}
              {homePage.content && homePage.content.sections && homePage.content.sections.length > 0 ? (
                <div className="space-y-16">
                  {homePage.content.sections.map((section: any, index: number) => (
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
                            pageType: 'whoWeServe',
                            language: currentLanguage,
                            sectionIndex: index,
                            comparisonTableData: comparisonTableData,
                            globalData: globalData
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg mb-8">
                    Content for this landing page is being prepared. Please check back soon!
                  </p>
                  <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      Coming Soon
                    </h3>
                    <p className="text-gray-600">
                      We&apos;re working on adding comprehensive content for this section. 
                      In the meantime, explore our individual service pages below.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}


      {/* Pages Listing */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Solutions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {(pages || [])
                .filter(page => page.basicInfo?.slug?.current && page.basicInfo.slug.current !== 'landing')
                .sort((a, b) => (a.basicInfo?.title || '').localeCompare(b.basicInfo?.title || ''))
                .map((page) => (
                  <a
                    key={page._id}
                    href={`/who-we-serve/${page.basicInfo?.slug?.current || '#'}`}
                    className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      {page.basicInfo?.icon && (
                        <div className="mb-4">
                          <img
                            src={urlForImage(page.basicInfo.icon, { width: 64, height: 64 })}
                            alt={page.basicInfo?.title || 'Page'}
                            className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        {page.basicInfo?.title || 'Untitled'}
                      </h3>
                      {page.basicInfo?.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {page.basicInfo.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-center">
                        <span className="text-green-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
                          Learn More →
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()

  try {
    // Get all pages
    const pages = await client.fetch(whoWeServeQueries.getAllWhoWeServePages, {
      language: currentLanguage
    }) || []

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

    // Get global data for feature lists
    const globalData = await client.fetch(`
      *[_type == "globalData" && dataType == "featureList" && (language == $language || language == null)] | order(_createdAt desc) {
        _id,
        name,
        dataType,
        featureList {
          title,
          description,
          selectAllFeatures,
          featureListReference-> {
            _id,
            title,
            description,
            slug,
            language,
            featureReferences[]-> {
              _id,
              title,
              slug,
              heroTitle,
              heroSubtitle,
              heroImage {
                asset-> {
                  _id,
                  url
                }
              },
              mainImage {
                asset-> {
                  _id,
                  url
                }
              },
              shortDescription,
              featureCategories[] {
                name,
                subheading,
                description,
                mainImage {
                  asset-> {
                    _id,
                    url
                  }
                },
                icon {
                  asset-> {
                    _id,
                    url
                  }
                },
                iconSvgCode
              },
              language
            },
            displaySettings {
              layout,
              itemsPerRow,
              showCategories,
              showSearch,
              showCTAs,
              highlightedFeaturesFirst
            }
          }
        },
        language
      }
    `, { language: currentLanguage })

    return {
      props: {
        pages,
        currentLanguage,
        homePage: homePage || null,
        comparisonTableData: comparisonTableData || null,
        globalData: globalData || []
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
