import React from 'react'
import { urlForImage } from '~/lib/sanity.image'

/**
 * TESTIMONIAL COMPONENT
 * 
 * Displays customer testimonials with ratings and author information.
 * Perfect for building trust and showcasing customer satisfaction.
 * 
 * SUPPORTED LAYOUTS:
 * - grid: Grid layout (default)
 * - carousel: Carousel-style layout
 * - list: Vertical list layout
 * 
 * DATA STRUCTURE EXPECTED:
 * {
 *   title: string,
 *   testimonials: [
 *     {
 *       quote: string,
 *       author: string,
 *       position?: string,
 *       company?: string,
 *       rating?: number (1-5),
 *       avatar?: image reference
 *     }
 *   ],
 *   layout: 'grid' | 'carousel' | 'list',
 *   showRating: boolean
 * }
 * 
 * USAGE EXAMPLES:
 * - Customer reviews
 * - Client testimonials
 * - User feedback
 * - Success stories
 */

interface TestimonialComponentProps {
  data: any
  slugData?: any
}

const TestimonialComponent: React.FC<TestimonialComponentProps> = ({ data, slugData }) => {
  // Handle missing data gracefully
  if (!data || !data.testimonials || data.testimonials.length === 0) {
    return null // Don't render anything if no real data
  }

  const { title, testimonials, layout, showRating } = data

  /**
   * Render star rating
   */
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

  /**
   * Get CSS classes based on layout type
   */
  const getLayoutClasses = () => {
    switch (layout) {
      case 'carousel':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
      case 'list':
        return 'space-y-8'
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          {title && (
            <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          )}
          
          {/* Testimonials Grid */}
          <div className={getLayoutClasses()}>
            {testimonials.map((testimonial: any, index: number) => (
              <div
                key={index}
                className={`${
                  layout === 'list' ? 'flex items-start space-x-4' : 'bg-white rounded-lg shadow-md p-6'
                }`}
              >
                {/* Avatar */}
                {testimonial.avatar && (
                  <div className={`${layout === 'list' ? 'w-16 h-16 flex-shrink-0' : 'w-16 h-16 mx-auto mb-4'}`}>
                    <img
                      src={urlForImage(testimonial.avatar)}
                      alt={testimonial.author}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}
                
                <div className={layout === 'list' ? 'flex-1' : 'text-center'}>
                  {/* Rating */}
                  {showRating && testimonial.rating && (
                    <div className="mb-2 text-lg">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                  
                  {/* Quote */}
                  <blockquote className="text-gray-700 mb-4 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
                  
                  {/* Author Info */}
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    {testimonial.position && (
                      <p className="text-sm text-gray-600">{testimonial.position}</p>
                    )}
                    {testimonial.company && (
                      <p className="text-sm text-gray-600">{testimonial.company}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialComponent
