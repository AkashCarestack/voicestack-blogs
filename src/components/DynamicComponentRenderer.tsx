import React from 'react'
import { urlForImage } from '~/lib/sanity.image'

interface DynamicComponentProps {
  component: any
  slugData?: {
    [key: string]: any
  }
}

const SLUG_COMPONENT_MAP: { [key: string]: any } = {
  'heroGrid': {
    componentType: 'FeatureGrid'
  },
  'testimonialSection': {
    componentType: 'Testimonial'
  },
  'listingSection': {
    componentType: 'Listing'
  },
  'rightImageSection': {
    componentType: 'RightImage'
  },
  'customSection': {
    componentType: 'Custom'
  }
}

const DynamicComponentRenderer: React.FC<DynamicComponentProps> = ({ 
  component, 
  slugData = {} 
}) => {
  // Check if we should use predefined slug component
  const slug = slugData?.slug
  const predefinedComponent = slug ? SLUG_COMPONENT_MAP[slug] : null

  let componentToRender = component
  let componentType = component?.componentType

  // If we have a predefined component for this slug, just use the component type
  if (predefinedComponent) {
    componentType = predefinedComponent.componentType
    componentToRender = {
      ...component,
      componentType: predefinedComponent.componentType
    }
  }

  if (!componentToRender || !componentType) {
    return null
  }

  const enhancedComponent = {
    ...componentToRender,
    slugData
  }

  switch (componentType) {
    case 'Listing':
      return <ListingComponent data={enhancedComponent.listingComponent} slugData={slugData} />
    case 'RightImage':
      return <RightImageComponent data={enhancedComponent.rightImageComponent} slugData={slugData} />
    case 'FeatureGrid':
      return <FeatureGridComponent data={enhancedComponent.featureGridComponent} slugData={slugData} />
    case 'Testimonial':
      return <TestimonialComponent data={enhancedComponent.testimonialComponent} slugData={slugData} />
    case 'Custom':
      return <CustomComponent data={enhancedComponent.customComponent} slugData={slugData} />
    default:
      return <div>Unknown component type: {componentType}</div>
  }
}

const ListingComponent: React.FC<{ data: any; slugData?: any }> = ({ data, slugData }) => {
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
const RightImageComponent: React.FC<{ data: any; slugData?: any }> = ({ data, slugData }) => {
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
const FeatureGridComponent: React.FC<{ data: any; slugData?: any }> = ({ data, slugData }) => {
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
const TestimonialComponent: React.FC<{ data: any; slugData?: any }> = ({ data, slugData }) => {
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

// Custom Component
const CustomComponent: React.FC<{ data: any; slugData?: any }> = ({ data, slugData }) => {
  if (!data) return null

  const { 
    title, 
    subtitle, 
    content, 
    buttonText, 
    buttonLink, 
    backgroundColor, 
    image,
    // Reference fields for pulling data from global schemas
    referenceGlobalSchema,
    referenceSchemaSlug
  } = data

  // Function to get data from referenced global schema
  const getReferencedData = () => {
    if (referenceGlobalSchema && referenceSchemaSlug) {
      // This would typically fetch data from the global schema
      // For now, we'll return a placeholder structure
      return {
        title: `Referenced from Global Schema: ${referenceSchemaSlug}`,
        subtitle: 'This data is pulled from global common schema',
        content: 'Custom component can reference data from global common schemas when fields are empty.'
      }
    }
    return null
  }

  // Function to get comparison table data from global schema
  const getComparisonTableData = () => {
    if (referenceGlobalSchema && referenceSchemaSlug) {
      // Check if the referenced data has comparison table data
      if (referenceGlobalSchema.dataType === 'comparisonTable' && referenceGlobalSchema.comparisonTable) {
        return referenceGlobalSchema.comparisonTable
      }
    }
    return null
  }

  // Use referenced data if local data is empty
  const referencedData = getReferencedData()
  const comparisonTableData = getComparisonTableData()
  const finalTitle = title || referencedData?.title
  const finalSubtitle = subtitle || referencedData?.subtitle
  const finalContent = content || referencedData?.content

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

  // Render comparison table
  const renderComparisonTable = () => {
    if (!comparisonTableData) return null

    return (
      <div className="mt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{comparisonTableData.title}</h3>
          {comparisonTableData.subtitle && (
            <p className="text-gray-600">{comparisonTableData.subtitle}</p>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                {comparisonTableData.columns.map((column: any, index: number) => (
                  <th
                    key={index}
                    className={`border border-gray-300 px-6 py-4 text-left font-semibold ${
                      column.highlighted ? 'bg-blue-100 text-blue-900' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.header}</span>
                      {column.badge && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                          {column.badge}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonTableData.rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-6 py-4 font-medium">
                    {row.feature}
                  </td>
                  {row.values.map((value: any, valueIndex: number) => (
                    <td
                      key={valueIndex}
                      className={`border border-gray-300 px-6 py-4 text-center ${
                        comparisonTableData.columns[valueIndex + 1]?.highlighted ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className={`${
                        value.type === 'check' ? 'text-green-600 font-bold' :
                        value.type === 'cross' ? 'text-red-600 font-bold' :
                        'text-gray-700'
                      }`}>
                        {value.text}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <section className={`py-16 ${getBackgroundClasses()}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {finalTitle && (
              <h2 className="text-3xl font-bold mb-4">{finalTitle}</h2>
            )}
            {finalSubtitle && (
              <p className="text-xl text-gray-600 mb-8">{finalSubtitle}</p>
            )}
            {finalContent && (
              <p className="text-gray-700 mb-8">{finalContent}</p>
            )}
            {image && (
              <div className="mb-8">
                <img
                  src={urlForImage(image)}
                  alt={finalTitle}
                  className="w-full h-auto rounded-lg shadow-lg mx-auto max-w-md"
                />
              </div>
            )}
            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {buttonText}
              </a>
            )}
            
            {/* Render comparison table if enabled */}
            {renderComparisonTable()}
            
            {/* Show reference info if using referenced data */}
            {referencedData && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">
                  <strong>Data Source:</strong> Referenced from Global Schema - {referenceSchemaSlug}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DynamicComponentRenderer
