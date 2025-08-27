import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getClient } from '~/lib/sanity.client'
import { dentalSoftwareQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import Layout from '~/components/Layout'

interface DentalSoftwarePage {
  _id: string
  title: string
  slug: { current: string }
  description: string
  icon: any
  order: number
  language: string
  content?: any
  heroSection?: {
    heroTitle?: string
    heroSubtitle?: string
    heroImage?: any
    heroBackground?: any
  }
  sections?: Array<{
    sectionTitle?: string
    sectionContent?: any[]
    sectionOrder?: number
  }>
  metaTitle?: string
  metaDescription?: string
}

interface DentalSoftwareIndexProps {
  pages: DentalSoftwarePage[]
  currentLanguage: string
  homePage?: DentalSoftwarePage
}

export default function DentalSoftwareIndex({ pages, currentLanguage, homePage }: DentalSoftwareIndexProps) {
  const router = useRouter()

  // If there's a landing page, serve its content directly
  if (homePage) {
    return (
      <Layout>
        <SimpleHead
          title={homePage.metaTitle || homePage.title}
          description={homePage.metaDescription || homePage.description}
        />

        {/* Hero Section */}
        {homePage.heroSection && (
          <section className="bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6">
                  {homePage.heroSection.heroTitle || homePage.title}
                </h1>
                {homePage.heroSection.heroSubtitle && (
                  <p className="text-xl opacity-90">
                    {homePage.heroSection.heroSubtitle}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Main Content */}
        {homePage.content && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto prose prose-lg">
                {/* Render the content blocks */}
                {homePage.content.map((block: any, index: number) => {
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

        {/* Sections */}
        {homePage.sections && homePage.sections.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                {homePage.sections
                  .sort((a: any, b: any) => (a.sectionOrder || 0) - (b.sectionOrder || 0))
                  .map((section: any, index: number) => (
                    <div key={index} className="mb-12">
                      {section.sectionTitle && (
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
                          {section.sectionTitle}
                        </h2>
                      )}
                      <div className="prose prose-lg max-w-4xl mx-auto">
                        {section.sectionContent?.map((block: any, blockIndex: number) => {
                          if (block._type === 'block') {
                            return (
                              <div key={blockIndex} className="mb-4">
                                <p>{block.children?.[0]?.text || ''}</p>
                              </div>
                            )
                          }
                          return null
                        })}
                      </div>
                    </div>
                  ))}
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
                {pages
                  .filter(page => page.slug.current !== 'landing')
                  .sort((a, b) => a.order - b.order)
                  .map((page) => (
                    <a
                      key={page._id}
                      href={`/dental-software/${page.slug.current}`}
                      className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                      <div className="p-6">
                        {page.icon && (
                          <div className="mb-4">
                            <img
                              src={urlForImage(page.icon, { width: 64, height: 64 })}
                              alt={page.title}
                              className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                          {page.title}
                        </h3>
                        {page.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {page.description}
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
      </Layout>
    )
  }

  // If no landing page, show the default listing page
  return (
    <Layout>
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
              {pages
                .filter(page => page.slug.current !== 'landing')
                .sort((a, b) => a.order - b.order)
                .map((page) => (
                  <a
                    key={page._id}
                    href={`/dental-software/${page.slug.current}`}
                    className="group block bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="p-6">
                      {page.icon && (
                        <div className="mb-4">
                          <img
                            src={urlForImage(page.icon, { width: 64, height: 64 })}
                            alt={page.title}
                            className="w-16 h-16 mx-auto group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                        {page.title}
                      </h3>
                      {page.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {page.description}
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
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()

  try {
    // Get all pages
    const pages = await client.fetch(dentalSoftwareQueries.getAllDentalSoftwarePages, {
      language: currentLanguage
    })

    // Get landing page using dedicated query
    const homePage = await client.fetch(dentalSoftwareQueries.getDentalSoftwarePageBySlug, {
      slug: 'landing',
      language: currentLanguage
    })

    return {
      props: {
        pages,
        currentLanguage,
        homePage: homePage || null
      },
      revalidate: 60 // Revalidate every minute
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
