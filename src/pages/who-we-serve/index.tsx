import { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getClient } from '~/lib/sanity.client'
import { whoWeServeQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import Layout from '~/components/Layout'

interface WhoWeServePage {
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
}

interface WhoWeServeIndexProps {
  pages: WhoWeServePage[]
  currentLanguage: string
  homePage?: WhoWeServePage
}

export default function WhoWeServeIndex({ pages, currentLanguage, homePage }: WhoWeServeIndexProps) {
  // If there's a landing page, show its content
  if (homePage) {
    return (
      <Layout>
        <SimpleHead
          title={homePage.title || "Who We Serve"}
          description={homePage.description || "Discover how our solutions serve different segments of the dental industry"}
        />

        {/* Hero Section - Use landing page hero if available */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">
                {homePage.heroSection?.heroTitle || homePage.title || "Who We Serve"}
              </h1>
              <p className="text-xl opacity-90">
                {homePage.heroSection?.heroSubtitle || homePage.description || "Discover how our solutions serve different segments of the dental industry"}
              </p>
            </div>
          </div>
        </section>

        {/* Landing Page Content */}
        {homePage.content && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto prose prose-lg">
                {/* You can add PortableText here to render the content */}
                <div className="text-gray-700">
                  {/* For now showing basic content - you can enhance this with PortableText */}
                  <p>{homePage.description}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Pages Listing */}
        <section className="py-16 bg-gray-50">
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
                      href={`${currentLanguage !== 'en' ? `/${currentLanguage}` : ''}/who-we-serve/${page.slug.current}`}
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
                        <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                          {page.title}
                        </h3>
                        {page.description && (
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {page.description}
                          </p>
                        )}
                        <div className="mt-4 flex items-center justify-center">
                          <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
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

  return (
    <Layout>
      <SimpleHead
        title="Who We Serve"
        description="Discover how our solutions serve different segments of the dental industry"
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
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
                    href={`${currentLanguage !== 'en' ? `/${currentLanguage}` : ''}/who-we-serve/${page.slug.current}`}
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
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {page.title}
                      </h3>
                      {page.description && (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {page.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-center">
                        <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform duration-300">
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
    const pages = await client.fetch(whoWeServeQueries.getAllWhoWeServePages, {
      language: currentLanguage
    })

    // Get landing page with full content if it exists
    let homePage = null
    const landingPageSlug = pages.find((page: WhoWeServePage) => page.slug.current === 'landing')
    if (landingPageSlug) {
      homePage = await client.fetch(whoWeServeQueries.getWhoWeServePageBySlug, {
        slug: 'landing',
        language: currentLanguage
      })
    }

    return {
      props: {
        pages,
        currentLanguage,
        homePage: homePage || null
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
