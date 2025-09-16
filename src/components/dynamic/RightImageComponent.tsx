import React from 'react'
import { urlForImage } from '~/lib/sanity.image'

/**
 * RIGHT IMAGE COMPONENT
 * 
 * Displays content with an image on the right side.
 * Perfect for showcasing products, services, or any content with visual elements.
 * 
 * SUPPORTED ALIGNMENTS:
 * - top: Align content to top
 * - center: Center align content (default)
 * - bottom: Align content to bottom
 * 
 * SUPPORTED BACKGROUNDS:
 * - white: White background (default)
 * - gray: Light gray background
 * - blue: Light blue background
 * 
 * DATA STRUCTURE EXPECTED:
 * {
 *   title: string,
 *   description: string,
 *   image: image reference,
 *   imageAlt?: string,
 *   contentAlignment: 'top' | 'center' | 'bottom',
 *   backgroundColor: 'white' | 'gray' | 'blue'
 * }
 * 
 * USAGE EXAMPLES:
 * - Product showcases
 * - Service descriptions
 * - About us sections
 * - Feature highlights
 */

interface RightImageComponentProps {
  data: any
  slugData?: any
}

const RightImageComponent: React.FC<RightImageComponentProps> = ({ data, slugData }) => {
  // Handle missing data gracefully
  if (!data) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Right Image Component</h2>
              <p className="text-gray-600">No data available for this right image component.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { title, description, image, imageAlt, contentAlignment, backgroundColor } = data

  /**
   * Get CSS classes based on content alignment
   */
  const getAlignmentClasses = () => {
    switch (contentAlignment) {
      case 'top':
        return 'items-start'
      case 'bottom':
        return 'items-end'
      default:
        return 'items-center'
    }
  }

  /**
   * Get CSS classes based on background color
   */
  const getBackgroundClasses = () => {
    switch (backgroundColor) {
      case 'gray':
        return 'bg-gray-50'
      case 'blue':
        return 'bg-blue-50'
      default:
        return 'bg-white'
    }
  }

  return (
    <section className={`py-16 ${getBackgroundClasses()}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${getAlignmentClasses()}`}>
            {/* Content */}
            <div className="space-y-6">
              {title && (
                <h2 className="text-3xl font-bold">{title}</h2>
              )}
              {description && (
                <p className="text-xl text-gray-600">{description}</p>
              )}
            </div>
            
            {/* Image */}
            {image && (
              <div className="relative">
                <img
                  src={urlForImage(image)}
                  alt={imageAlt || title}
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RightImageComponent
