import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'

interface Feature {
  title: string
  description: string
  shortDescription: string
  icon?: {
    asset: {
      _id: string
      url: string
    }
  }
  image?: {
    asset: {
      _id: string
      url: string
    }
  }
  isHighlighted: boolean
  order?: number
  category: string
  cta?: {
    text: string
    link: string
    type: 'primary' | 'secondary' | 'link'
  }
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
    const categorySet = new Set(features.map(f => f.category).filter(Boolean))
    return Array.from(categorySet).sort()
  }, [features])

  // Filter and sort features
  const filteredAndSortedFeatures = useMemo(() => {
    let filtered = features

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(feature => feature.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(feature =>
        feature.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feature.shortDescription.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort by highlighted first, then by order
    if (displaySettings.highlightedFeaturesFirst) {
      filtered.sort((a, b) => {
        if (a.isHighlighted && !b.isHighlighted) return -1
        if (!a.isHighlighted && b.isHighlighted) return 1
        return (a.order || 0) - (b.order || 0)
      })
    } else {
      filtered.sort((a, b) => (a.order || 0) - (b.order || 0))
    }

    return filtered
  }, [features, selectedCategory, searchTerm, displaySettings.highlightedFeaturesFirst])

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
      key={index}
      className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ${
        feature.isHighlighted ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="p-6">
        {(feature.icon || feature.image) && (
          <div className="mb-4">
            {feature.icon ? (
              <Image
                src={feature.icon.asset.url}
                alt={feature.title}
                width={48}
                height={48}
                className="w-12 h-12 object-contain"
              />
            ) : feature.image ? (
              <Image
                src={feature.image.asset.url}
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
          {feature.shortDescription && (
            <p className="text-gray-600 text-sm mb-2">
              {feature.shortDescription}
            </p>
          )}
          {feature.description && Array.isArray(feature.description) && (
            <div className="text-gray-700">
              <PortableText value={feature.description} />
            </div>
          )}
        </div>

        {/* CTA Button */}
        {displaySettings.showCTAs && feature.cta && (
          <div className="mt-auto">
            <a
              href={feature.cta.link}
              className={getCtaClasses(feature.cta.type)}
            >
              {feature.cta.text}
            </a>
          </div>
        )}
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
          {(feature.icon || feature.image) && (
            <div className="flex-shrink-0">
              {feature.icon ? (
                <Image
                  src={feature.icon.asset.url}
                  alt={feature.title}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain"
                />
              ) : feature.image ? (
                <Image
                  src={feature.image.asset.url}
                  alt={feature.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ) : null}
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {feature.title}
            </h3>
            {feature.shortDescription && (
              <p className="text-gray-600 text-sm mb-2">
                {feature.shortDescription}
              </p>
            )}
            {feature.description && (
              <div className="text-gray-700 text-sm">
                <PortableText value={feature.description} />
              </div>
            )}
            {displaySettings.showCTAs && feature.cta && (
              <div className="mt-2">
                <a
                  href={feature.cta.link}
                  className={getCtaClasses(feature.cta.type)}
                >
                  {feature.cta.text}
                </a>
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
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
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
            {categories.map((category) => (
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
