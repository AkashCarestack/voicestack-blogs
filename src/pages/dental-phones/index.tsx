import { GetStaticProps } from 'next'
import { getClient } from '~/lib/sanity.client'
import { urlForImage } from '~/lib/sanity.image'
import SimpleHead from '~/components/common/SimpleHead'
import Queries from '~/components/revamp/queries'
import IntegrationsGrid from '~/components/revamp/components/common/IntegrationsGrid'

interface Category {
  _id: string
  title: string
}

interface DentalPhone {
  _id: string
  name: string
  slug: { current: string }
  description: string
  image?: any
  features?: string[]
  price?: number
  category?: Category | string
  language?: string
}

interface DentalPhonesPageProps {
  phones: DentalPhone[]
  currentLanguage: string
  categories: string[]
  integrations?: Integration[]
}

interface Integration {
  _id: string
  title: string
  headline?: string
  description?: any
  shortDescription?: string
  image?: { asset?: { _id: string; url: string; altText?: string } }
  link?: string
  order?: number
  language?: string
}

export default function DentalPhonesIndex({ phones, currentLanguage, categories, integrations = [] }: DentalPhonesPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleHead
        title="Dental Phones | Professional Dental Phone Systems"
        description="Explore our range of professional dental phone systems designed for modern dental practices."
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">
              Professional Dental Phones
            </h1>
            <p className="text-xl opacity-90">
              High-quality phone systems designed specifically for dental practices
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Filter by Category</h2>
            <div className="flex flex-wrap gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                All Phones
              </button>
              {categories.map((category) => (
                <button 
                  key={category}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Phones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {phones.map((phone) => (
            <div 
              key={phone._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {phone.image && (
                <div className="h-64 bg-gray-100 flex items-center justify-center p-4">
                  <img
                    src={urlForImage(phone.image, { width: 240, height: 240 })}
                    alt={phone.name}
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{phone.name}</h2>
                {phone.category && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-3">
                    {typeof phone.category === 'object' && (phone.category as Category)?.title
                      ? (phone.category as Category).title
                      : (phone.category as string)}
                  </span>
                )}
                {phone.description && (
                  <p className="text-gray-600 mb-4">{phone.description}</p>
                )}
                {phone.features && phone.features.length > 0 && (
                  <ul className="mb-4 space-y-1">
                    {phone.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex justify-between items-center mt-6">
                  {phone.price && (
                    <span className="text-2xl font-bold text-gray-900">
                      ${phone.price.toFixed(2)}
                    </span>
                  )}
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Integrations Grid (from Global Data selection) */}
      {integrations && integrations.length > 0 && (
        <div className="mt-12">
          <IntegrationsGrid integrations={integrations} />
        </div>
      )}
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const currentLanguage = locale || 'en'
  const client = getClient()

  try {
    // Fetch dental phones data
    const phones: DentalPhone[] = await client.fetch(
      `*[_type == "dentalPhone" && language == $language] | order(name asc) {
        _id,
        name,
        slug,
        description,
        image,
        features,
        price,
        category->{_id, title},
        language
      }`,
      { language: currentLanguage }
    ) || []

    // Extract unique categories
    const categories = [...new Set(
      phones
        .filter(phone => phone.category && typeof phone.category === 'object' && 'title' in phone.category)
        .map(phone => (phone.category as Category).title)
        .filter(Boolean)
    )].sort()

    // Process phones data
    const processedPhones = phones.map(phone => ({
      ...phone,
      category: typeof phone.category === 'object' && phone.category ? 
        (phone.category as Category).title : 
        phone.category
    }))

    // Get global data for feature lists (if needed in the future)
    // const globalData = await client.fetch(`
    //   *[_type == "globalData" && dataType == "featureList" && (language == $language || language == null)] {
    //     _id,
    //     name,
    //     dataType,
    //     featureList {
    //       title,
    //       description
    //     }
    //   }
    // `, { language: currentLanguage })

    // Fetch integrations grid data (Global: integrationGrid)
    let integrations: Integration[] = []
    try {
      const queries = new Queries('integrations', currentLanguage)
      integrations = await queries.fetchIntegrationsData(currentLanguage)
    } catch (e) {
      console.warn('Failed to fetch integrations for index page:', e)
    }

    return {
      props: {
        phones: processedPhones,
        currentLanguage,
        categories,
        integrations,
      },
      revalidate: 60 // Revalidate every minute
    }
  } catch (error) {
    console.error('Error fetching dental phones data:', error)
    return {
      props: {
        phones: [],
        currentLanguage,
        categories: []
      },
      revalidate: 60
    }
  }
}
