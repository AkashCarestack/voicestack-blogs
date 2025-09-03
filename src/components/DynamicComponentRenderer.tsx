import React from 'react'
import { urlForImage } from '~/lib/sanity.image'
import CallToActionSection from './custom/CallToActionSection'

interface DynamicComponentProps {
  component: any
}

const DynamicComponentRenderer: React.FC<DynamicComponentProps> = ({ component }) => {
  if (!component || !component.componentType) {
    return null
  }

  const { componentType } = component

  switch (componentType) {
    case 'listingComponent':
      return <ListingComponent data={component.listingComponent} />
    case 'rightImageComponent':
      return <RightImageComponent data={component.rightImageComponent} />
    case 'featureGridComponent':
      return <FeatureGridComponent data={component.featureGridComponent} />
    case 'testimonialComponent':
      return <TestimonialComponent data={component.testimonialComponent} />
    default:
      return <div>Unknown component type: {componentType}</div>
  }
}

// Listing Component
const ListingComponent: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null

  const { title, description, items, layout } = data

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
          {title && (
            <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
          )}
          {description && (
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {description}
            </p>
          )}
          <div className={getLayoutClasses()}>
            {items?.map((item: any, index: number) => (
              <div
                key={index}
                className={`${
                  layout === 'cards' ? 'bg-white rounded-lg shadow-md p-6' : ''
                }`}
              >
                {item.icon && (
                  <div className="w-16 h-16 mb-4">
                    <img
                      src={urlForImage(item.icon)}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Right Image Component
const RightImageComponent: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null

  const { title, description, image, imageAlt, contentAlignment, backgroundColor } = data

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
            <div className="space-y-6">
              {title && (
                <h2 className="text-3xl font-bold">{title}</h2>
              )}
              {description && (
                <p className="text-xl text-gray-600">{description}</p>
              )}
            </div>
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

// Feature Grid Component
const FeatureGridComponent: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null

  const { title, description, features, gridColumns, showIcons } = data

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
          {title && (
            <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
          )}
          {description && (
            <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
              {description}
            </p>
          )}
          <div className={`grid ${getGridClasses()} gap-8`}>
            {features?.map((feature: any, index: number) => (
              <div key={index} className="text-center">
                {showIcons && feature.icon && (
                  <div className="w-20 h-20 mx-auto mb-4">
                    <img
                      src={urlForImage(feature.icon)}
                      alt={feature.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
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

// Testimonial Component
const TestimonialComponent: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return null

  const { title, testimonials, layout, showRating } = data

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ★
      </span>
    ))
  }

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
          {title && (
            <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
          )}
          <div className={getLayoutClasses()}>
            {testimonials?.map((testimonial: any, index: number) => (
              <div
                key={index}
                className={`${
                  layout === 'list' ? 'flex items-start space-x-4' : 'bg-white rounded-lg shadow-md p-6'
                }`}
              >
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
                  {showRating && testimonial.rating && (
                    <div className="mb-2 text-lg">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}
                  <blockquote className="text-gray-700 mb-4 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </blockquote>
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



export default DynamicComponentRenderer
