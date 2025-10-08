import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { whyVoicestackQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import CustomHead from '~/components/common/CustomHead'
import Layout from '~/components/Layout'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'

interface WhyVoicestackPage {
  _id: string
  basicInfo: {
    title: string
    slug: { current: string }
    description: string
    icon: any
  }
  content?: {
    sections: any[]
  }
  seo?: {
    metaTitle?: string
    metaDescription?: string
  }
  language: string
}

interface PageProps {
  page: WhyVoicestackPage
  comparisonTableData?: any
  globalData?: any[]
  currentLanguage: string
}

export default function WhyVoicestackSlugPage({ page, comparisonTableData, globalData, currentLanguage }: PageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">The requested page could not be found.</p>
          <a href="/Why-voicestack" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Why Voicestack
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      <CustomHead 
        title={page.seo?.metaTitle || `Why Voicestack - ${page.basicInfo.title}`}
        description={page.seo?.metaDescription || page.basicInfo.description}
      />
      <Layout>
        <div className="min-h-screen bg-gray-50">
          {/* Hero Section */}
          <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                {page.basicInfo.icon && (
                  <div className="mb-6">
                    <img
                      src={urlForImage(page.basicInfo.icon)}
                      alt={page.basicInfo.title}
                      className="w-20 h-20 mx-auto object-contain"
                    />
                  </div>
                )}
                <h1 className="text-5xl font-bold mb-6">
                  {page.basicInfo.title}
                </h1>
                <p className="text-xl">
                  {page.basicInfo.description}
                </p>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          {page.content && page.content.sections && (
            <section className="py-16">
              <div className="container mx-auto px-4">
                {page.content.sections.map((section, index) => (
                  <DynamicComponentRenderer
                    key={index}
                    component={section.component}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Fallback content if no sections */}
          {(!page.content || !page.content.sections || page.content.sections.length === 0) && (
            <section className="py-16">
              <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-lg shadow-lg p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                      Content Coming Soon
                    </h2>
                    <p className="text-gray-600">
                      This page is under construction. Content for &quot;{page.basicInfo.title}&quot; will be available soon.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const client = getClient()
  
  try {
    // Get all Why Voicestack page slugs for all languages
    const allSlugs = await Promise.all(
      (locales || ['en']).map(async (locale) => {
        const slugs = await client.fetch(`
          *[_type == "whyVoicestack" && (language == $language || language == null)] {
            basicInfo {
              slug
            }
          }
        `, {
          language: locale
        })
        return slugs.map((item: any) => ({
          params: { slug: item.basicInfo.slug.current },
          locale
        }))
      })
    )

    const paths = allSlugs.flat()

    return {
      paths,
      fallback: true
    }
  } catch (error) {
    console.error('Error generating static paths for Why Voicestack:', error)
    return {
      paths: [],
      fallback: true
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const slug = params?.slug as string
  const currentLanguage = locale || 'en'
  const client = getClient()

  try {
    // Get the specific page
    const page = await client.fetch(`
      *[_type == "whyVoicestack" && basicInfo.slug.current == $slug && (language == $language || language == null)] {
        _id,
        basicInfo {
          title,
          slug,
          description,
          icon
        },
        content {
          sections[] {
            title,
            slug,
            component {
              componentType,
              tabsListingComponent {
                headline,
                subDescription,
                tabs[] {
                  tabHeading,
                  tabSubHeading,
                  description,
                  image
                }
              },
              customComponent {
                title,
                content,
                image
              }
            }
          }
        },
        seo {
          metaTitle,
          metaDescription
        },
        language
      }[0]
    `, {
      slug,
      language: currentLanguage
    })

    if (!page) {
      return {
        notFound: true
      }
    }

    // Get comparison table data for CustomComponent
    const comparisonTableData = await client.fetch(`
      *[_type == "globalData" && (language == $language || language == null)][0] {
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
              value,
              highlighted
            }
          }
        },
        dataType
      }
    `, { language: currentLanguage })

    // Get global data for components
    const globalData = await client.fetch(`
      *[_type == "globalData" && (language == $language || language == null)] {
        _id,
        title,
        comparisonTable,
        dataType
      }
    `, { language: currentLanguage })

    return {
      props: {
        page,
        comparisonTableData,
        globalData,
        currentLanguage
      },
      revalidate: 60
    }
  } catch (error) {
    console.error('Error fetching Why Voicestack page:', error)
    return {
      notFound: true
    }
  }
}