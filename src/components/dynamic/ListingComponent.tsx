import React from 'react'
import { urlForImage } from '~/lib/sanity.image'

/**
 * LISTING COMPONENT
 * 
 * Displays a list of items in various layouts.
 * Perfect for showcasing features, services, or any list-based content.
 * 
 * SUPPORTED LAYOUTS:
 * - vertical: Simple vertical list
 * - grid: Grid layout with cards
 * - cards: Card-based layout with shadows
 * 
 * DATA STRUCTURE EXPECTED:
 * {
 *   title: string,
 *   description: string,
 *   items: [
 *     {
 *       title: string,
 *       description: string,
 *       icon?: image reference
 *     }
 *   ],
 *   layout: 'vertical' | 'grid' | 'cards'
 * }
 * 
 * USAGE EXAMPLES:
 * - Features list
 * - Services overview
 * - Product benefits
 * - Team members
 */

interface ListingComponentProps {
  data: any
  slugData?: any
}

const ListingComponent: React.FC<ListingComponentProps> = ({ data, slugData }) => {
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('ListingComponent Debug:', { data, slugData })
  }

  // Handle missing data gracefully
  if (!data) {
    // console.log('ListingComponent: No data provided', { data, slugData })
    return (
      <div className="py-16 bg-red-50 border border-red-200 rounded-lg mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Listing Component Error</h3>
          <p className="text-red-600">No data provided to ListingComponent</p>
        </div>
      </div>
    )
  }

  if (!data.items || data.items.length === 0) {
    // console.log('ListingComponent: No items array or empty items', { data, slugData })
    return (
      <div className="py-16 bg-yellow-50 border border-yellow-200 rounded-lg mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Listing Component</h3>
          <p className="text-yellow-600">No items to display</p>
          <p className="text-sm text-yellow-500 mt-2">Title: {data.title || 'No title'}</p>
        </div>
      </div>
    )
  }

  const { title, description, items, layout } = data

  /**
   * Get CSS classes based on layout type
   */
  const getLayoutClasses = () => {
    switch (layout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      case 'cards':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      default:
        return 'space-y-4'
    }
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          {title && (
            <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
          )}
          
          {/* Description */}
          {description && (
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {description}
            </p>
          )}
          
          {/* Items List */}
          <div className={getLayoutClasses()}>
            {items.map((item: any, index: number) => (
              <div
                key={index}
                className={`${
                  layout === 'cards' ? 'bg-white rounded-lg shadow-md p-6' : ''
                }`}
              >
                {/* Icon */}
                {item.icon && (
                  <div className="w-16 h-16 mb-4">
                    <img
                      src={urlForImage(item.icon)}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Title */}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                
                {/* Description */}
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ListingComponent
