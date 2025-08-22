import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { getClient } from '~/lib/sanity.client'
import { dentalSoftwareQueries } from '~/lib/sanity.queries'
import { urlForImage } from '~/lib/sanity.image'
import { PortableText } from '@portabletext/react'
import SimpleHead from '~/components/common/SimpleHead'
import Layout from '~/components/Layout'

interface DentalSoftwarePage {
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

interface DentalSoftwarePageProps {
  page: DentalSoftwarePage
  allPages: DentalSoftwarePage[]
  currentLanguage: string
}

export default function DentalSoftwarePage({ page, allPages, currentLanguage }: DentalSoftwarePageProps) {
  const router = useRouter()

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  if (!page) {
    return <div>Page not found</div>
  }

  const isHomePage = page.slug.current === 'home'

  return (
    <Layout>
      <SimpleHead
        title={page.metaTitle || page.title}
        description={page.metaDescription || page.description}
      />

      {/* Hero Section */}
      {page.heroSection && (
        <section className="relative bg-gradient-to-r from-green-900 to-green-700 text-white py-20">
          {page.heroSection.heroBackground && (
            <div className="absolute inset-0 opacity-20">
              <img
                src={urlForImage(page.heroSection.heroBackground)}
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {page.heroSection.heroTitle && (
                <h1 className="text-5xl font-bold mb-6">
                  {page.heroSection.heroTitle}
                </h1>
              )}
              {page.heroSection.heroSubtitle && (
                <p className="text-xl mb-8 opacity-90">
                  {page.heroSection.heroSubtitle}
                </p>
              )}
              {page.heroSection.heroImage && (
                <div className="mb-8">
                  <img
                    src={urlForImage(page.heroSection.heroImage)}
                    alt="Hero"
                    className="mx-auto max-w-md rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Page Title */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {page.title}
              </h1>
              {page.description && (
                <p className="text-xl text-gray-600">
                  {page.description}
                </p>
              )}
            </div>

            {/* Content */}
            {page.content && page.content.length > 0 && (
              <div className="prose prose-lg max-w-none mb-12">
                <PortableText value={page.content} />
              </div>
            )}

            {/* Page Sections */}
            {page.sections && page.sections.length > 0 && (
              <div className="space-y-16">
                {page.sections
                  .sort((a, b) => a.sectionOrder - b.sectionOrder)
                  .map((section, index) => (
                    <div key={index} className="border-t pt-12">
                      <h2 className="text-3xl font-bold text-gray-900 mb-6">
                        {section.sectionTitle}
                      </h2>
                      <div className="prose prose-lg max-w-none">
                        <PortableText value={section.sectionContent} />
                      </div>
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
                    .filter(p => p.slug.current !== page.slug.current)
                    .map((otherPage) => (
                      <a
                        key={otherPage._id}
                        href={`/dental-software/${otherPage.slug.current}`}
                        className="block p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {otherPage.title}
                        </h4>
                        {otherPage.description && (
                          <p className="text-gray-600 text-sm">
                            {otherPage.description}
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
    
    // Add home page path
    paths.push({
      params: { slug: 'home' },
      locale: language === 'en' ? 'en' : language
    })

    // Add other page paths
    for (const slugData of slugs) {
      if (slugData.slug.current !== 'home') {
        paths.push({
          params: { slug: slugData.slug.current },
          locale: language === 'en' ? 'en' : language
        })
      }
    }
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

    if (!page) {
      return {
        notFound: true
      }
      }

    return {
      props: {
        page,
        allPages,
        currentLanguage
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
