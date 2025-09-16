import React from 'react'
import { urlForImage } from '~/lib/sanity.image'

/**
 * FEATURE GRID COMPONENT
 * 
 * Displays features in a responsive grid layout.
 * Perfect for showcasing product features, services, or key benefits.
 * 
 * SUPPORTED GRID SIZES:
 * - 2: Two columns on desktop
 * - 3: Three columns on desktop (default)
 * - 4: Four columns on desktop
 * 
 * DATA STRUCTURE EXPECTED:
 * {
 *   title: string,
 *   description: string,
 *   features: [
 *     {
 *       title: string,
 *       description: string,
 *       icon?: image reference,
 *       link?: string
 *     }
 *   ],
 *   gridColumns: '2' | '3' | '4',
 *   showIcons: boolean
 * }
 * 
 * USAGE EXAMPLES:
 * - Product features
 * - Service offerings
 * - Key benefits
 * - Technology stack
 * - Team capabilities
 */

interface FeatureGridComponentProps {
  data: any
  slugData?: any
}

const FeatureGridComponent: React.FC<FeatureGridComponentProps> = ({ data, slugData }) => {
  // Handle missing data gracefully
  if (!data || !data.features || data.features.length === 0) {
    return null // Don't render anything if no real data
  }

  const { title, description, features, gridColumns, showIcons } = data

  /**
   * Get CSS classes based on grid column count
   */
  const getGridClasses = () => {
    switch (gridColumns) {
      case '2':
        return 'grid-cols-1 md:grid-cols-2'
      case '4':
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
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
          
          {/* Features Grid */}
          <div className={`grid ${getGridClasses()} gap-8`}>
            {features.map((feature: any, index: number) => (
              <div key={index} className="text-center">
                {/* Icon */}
                {showIcons && feature.icon && (
                  <div className="w-20 h-20 mx-auto mb-4">
                    <img
                      src={urlForImage(feature.icon)}
                      alt={feature.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {/* Title */}
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                
                {/* Description */}
                <p className="text-gray-600 mb-4">{feature.description}</p>
                
                {/* Link */}
                {feature.link && (
                  <a
                    href={feature.link}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Learn More
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeatureGridComponent
