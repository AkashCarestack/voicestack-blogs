import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

interface Feature {
  _id: string
  title: string
  slug: {
    current: string
  }
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: {
    asset: {
      _id: string
      url: string
    }
  }
  mainImage?: {
    asset: {
      _id: string
      url: string
    }
  }
  shortDescription?: any
  featureCategories?: Array<{
    name: string
    subheading?: string
    description?: string
    mainImage?: {
      asset: {
        _id: string
        url: string
      }
    }
    icon?: {
      asset: {
        _id: string
        url: string
      }
    }
    iconSvgCode?: string
  }>
  language: string
}

interface DisplaySettings {
  layout: 'grid' | 'list' | 'tabs' | 'accordion'
  itemsPerRow?: number
  showCategories: boolean
  showSearch: boolean
  showCTAs: boolean
  highlightedFeaturesFirst: boolean
}

interface FeatureListDisplayProps {
  title?: string
  description?: string
  features: Feature[]
  displaySettings?: DisplaySettings
  className?: string
}

const FeatureListDisplay: React.FC<FeatureListDisplayProps> = ({
  title,
  description,
  features = [],
  displaySettings = {
    layout: 'grid',
    itemsPerRow: 3,
    showCategories: true,
    showSearch: false,
    showCTAs: true,
    highlightedFeaturesFirst: true
  },
  className = ''
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState<string>('')

  // Get unique categories from features
  const categories = useMemo(() => {
    const categorySet = new Set()
    features.forEach(feature => {
      feature.featureCategories?.forEach(cat => {
        categorySet.add(cat.name)
      })
    })
    return Array.from(categorySet).sort()
  }, [features])

  // Filter and sort features
  const filteredAndSortedFeatures = useMemo(() => {
    let filtered = features

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(feature => 
        feature.featureCategories?.some(cat => cat.name === selectedCategory)
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(feature =>
        feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (feature.shortDescription && typeof feature.shortDescription === 'string' && 
         feature.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feature.heroSubtitle && feature.heroSubtitle.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // Sort by title (since we don't have order/highlighted in the new structure)
    filtered.sort((a, b) => a.title.localeCompare(b.title))

    return filtered
  }, [features, selectedCategory, searchTerm])

  const getGridCols = () => {
    const cols = displaySettings.itemsPerRow || 3
    return {
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    }[cols] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  }

  const getCtaClasses = (type: string) => {
    const baseClasses = 'inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors'
    switch (type) {
      case 'primary':
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700`
      case 'secondary':
        return `${baseClasses} bg-gray-200 text-gray-900 hover:bg-gray-300`
      case 'link':
        return `${baseClasses} text-blue-600 hover:text-blue-800 underline`
      default:
        return baseClasses
    }
  }

  const renderFeature = (feature: Feature, index: number) => (
    <div
      key={feature._id || index}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        {(feature.heroImage || feature.mainImage) && (
          <div className="mb-4">
            {feature.heroImage ? (
              <Image
                src={feature.heroImage.asset.url}
                alt={feature.title}
                width={200}
                height={120}
                className="w-full h-32 object-cover rounded-md"
              />
            ) : feature.mainImage ? (
              <Image
                src={feature.mainImage.asset.url}
                alt={feature.title}
                width={200}
                height={120}
                className="w-full h-32 object-cover rounded-md"
              />
            ) : null}
          </div>
        )}

        {/* Feature Content */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {feature.title}
          </h3>
          {feature.heroSubtitle && (
            <p className="text-gray-600 text-sm mb-2">
              {feature.heroSubtitle}
            </p>
          )}
          {feature.shortDescription && (
            <div className="text-gray-700">
              <PortableText value={feature.shortDescription} />
            </div>
          )}
        </div>

        {/* Feature Categories */}
        {feature.featureCategories && feature.featureCategories.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {feature.featureCategories.map((category, catIndex) => (
                <span
                  key={catIndex}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {category.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Link to Feature Page */}
        <div className="mt-auto">
          <a
            href={`/features/${feature.slug.current}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            Learn More →
          </a>
        </div>
      </div>
    </div>
  )

  const renderGridLayout = () => (
    <div className={`grid gap-6 ${getGridCols()}`}>
      {filteredAndSortedFeatures.map((feature, index) => renderFeature(feature, index))}
    </div>
  )

  const renderListLayout = () => (
    <div className="space-y-4">
      {filteredAndSortedFeatures.map((feature, index) => (
        <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-md">
          {feature.mainImage && (
            <div className="flex-shrink-0">
              <Image
                src={feature.mainImage.asset.url}
                alt={feature.title}
                width={80}
                height={80}
                className="w-20 h-20 object-cover rounded-md"
              />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {feature.title}
            </h3>
            {feature.shortDescription && (
              <div className="text-gray-600 text-sm mb-2">
                {Array.isArray(feature.shortDescription) ? (
                  <PortableText value={feature.shortDescription} />
                ) : (
                  <p>{String(feature.shortDescription)}</p>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )

  return (
    <div className={`feature-list-display ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="text-center mb-8">
          {title && (
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {title}
            </h2>
          )}
          {description && (
            <div className="text-lg text-gray-600 max-w-3xl mx-auto">
              {Array.isArray(description) ? (
                <PortableText value={description} />
              ) : (
                <p>{String(description)}</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Search */}
      {displaySettings.showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto block px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {displaySettings?.showCategories && categories.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All Features
            </button>
            {categories.map((category: string) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Features List */}
      <div className="features-container">
        {displaySettings.layout === 'grid' && renderGridLayout()}
        {displaySettings.layout === 'list' && renderListLayout()}
        {/* TODO: Implement tabs and accordion layouts */}
      </div>

      {/* No Results */}
      {filteredAndSortedFeatures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No features found matching your criteria.
          </p>
        </div>
      )}
    </div>
  )
}

export default FeatureListDisplay
