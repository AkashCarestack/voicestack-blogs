import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getClient } from '~/lib/sanity.client'
import { dentalSoftwareQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'

interface DentalSoftwarePage {
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

interface DentalSoftwareIndexProps {
  pages: DentalSoftwarePage[]
  currentLanguage: string
  homePage?: DentalSoftwarePage
  comparisonTableData?: any
}

export default function DentalSoftwareIndex({ pages, currentLanguage, homePage, comparisonTableData }: DentalSoftwareIndexProps) {
  const router = useRouter()

  // If there's a landing page, serve its content directly
  if (homePage) {
    return (
      <div>
        <SimpleHead
          title={homePage.seo?.metaTitle || homePage.basicInfo.title}
          description={homePage.seo?.metaDescription || homePage.basicInfo.description}
        />

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                {homePage.basicInfo?.title || 'Dental Software'}
              </h1>
              {homePage.basicInfo?.description && (
                <p className="text-xl opacity-90">
                  {homePage.basicInfo.description}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Main Content */}
        {homePage.content?.mainContent && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto prose prose-lg">
                {/* Render the content blocks */}
                {homePage.content.mainContent.map((block: any, index: number) => {
                  if (block._type === 'block') {
                    return (
                      <div key={index} className="mb-6">
                        {/* You can add more sophisticated block rendering here */}
                        <p>{block.children?.[0]?.text || ''}</p>
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </section>
        )}

        {/* Dynamic Content Sections from CMS */}
        {homePage.content?.sections && homePage.content.sections.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                  {homePage.basicInfo.title}
                </h2>
                {homePage.basicInfo.description && (
                  <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
                    {homePage.basicInfo.description}
                  </p>
                )}
                
                {/* Dynamic Content Sections from CMS */}
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
              </div>
            </div>
          </section>
        )}

        {/* Other Pages Listing */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Our Solutions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(pages || [])
                  .filter(page => page.basicInfo.slug.current !== 'landing')
                  .sort((a, b) => a.basicInfo.title.localeCompare(b.basicInfo.title))
                  .map((page) => (
                    <a
                      key={page._id}
                      href={`/dental-software/${page.basicInfo.slug.current}`}
                      className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="p-6">
                        {page.basicInfo.icon && (
                          <div className="mb-4">
                            <img
                              src={urlForImage(page.basicInfo.icon, { width: 64, height: 64 })}
                              alt={page.basicInfo.title}
                              className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                          {page.basicInfo.title}
                        </h3>
                        {page.basicInfo.description && (
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

  // If no landing page, show the default listing page
  return (
    <div>
      <SimpleHead
        title="Dental Software"
        description="Explore our comprehensive dental software solutions and integrations"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Dental Software
            </h1>
            <p className="text-xl opacity-90">
              Explore our comprehensive dental software solutions and integrations
            </p>
          </div>
        </div>
      </section>

      {/* Pages Listing */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Solutions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(pages || [])
                .filter(page => page.basicInfo.slug.current !== 'landing')
                .sort((a, b) => a.basicInfo.title.localeCompare(b.basicInfo.title))
                .map((page) => (
                  <a
                    key={page._id}
                    href={`/dental-software/${page.basicInfo.slug.current}`}
                    className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      {page.basicInfo.icon && (
                        <div className="mb-4">
                          <img
                            src={urlForImage(page.basicInfo.icon, { width: 64, height: 64 })}
                            alt={page.basicInfo.title}
                            className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        {page.basicInfo.title}
                      </h3>
                      {page.basicInfo.description && (
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
    const pages = await client.fetch(dentalSoftwareQueries.getAllDentalSoftwarePages, {
      language: currentLanguage
    }) || []

    // Get landing page using dedicated query
    const homePage = await client.fetch(dentalSoftwareQueries.getDentalSoftwarePageBySlug, {
      slug: 'landing',
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
        pages,
        currentLanguage,
        homePage: homePage || null,
        comparisonTableData: comparisonTableData || null
      },
    }
  } catch (error) {
    console.error('Error fetching Dental Software pages:', error)
    return {
      props: {
        pages: [],
        currentLanguage,
        homePage: null
      }
    }
  }
}
