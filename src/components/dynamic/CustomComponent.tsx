import React, { useEffect, useState } from 'react'
import { urlForImage } from '~/lib/sanity.image'
import { getClient } from '~/lib/sanity.client'
import { getAllFeatures } from '~/lib/sanity.queries'
import FeatureListDisplay from '~/components/features/FeatureListDisplay'
import CategoryFeatureTabs from '~/components/features/CategoryFeatureTabs'

/**
 * CUSTOM COMPONENT
 * 
 * Displays custom content with support for global schema references.
 * Perfect for complex content that needs to reference global data.
 * 
 * FEATURES:
 * - Global schema references
 * - Comparison table support
 * - Custom content rendering
 * - Background color options
 * 
 * DATA STRUCTURE EXPECTED:
 * {
 *   title: string,
 *   subtitle: string,
 *   content: string,
 *   buttonText?: string,
 *   buttonLink?: string,
 *   backgroundColor: 'white' | 'gray' | 'blue',
 *   image?: image reference,
 *   referenceGlobalSchema?: {
 *     _ref: string,
 *     _type: 'reference'
 *   },
 *   referenceSchemaSlug?: string
 * }
 * 
 * USAGE EXAMPLES:
 * - Comparison tables
 * - Global data references
 * - Custom landing sections
 * - Complex content blocks
 */

interface CustomComponentProps {
  data: any
  slugData?: any
}

const CustomComponent: React.FC<CustomComponentProps> = ({ data, slugData }) => {

  if (!data) {
    console.log('CustomComponent: No data provided', { data, slugData })
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Custom Component</h2>
              <p className="text-gray-600">No data available for this custom component.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const { 
    title, 
    subtitle, 
    content, 
    buttonText, 
    buttonLink, 
    backgroundColor, 
    image,
    // Reference fields for pulling data from global schemas
    referenceGlobalSchema
  } = data

  /**
   * Get data from referenced global schema
   */
  const getReferencedData = () => {
    if (referenceGlobalSchema) {
      // Check if it's a reference object that needs to be resolved
      if (referenceGlobalSchema._type === 'reference') {
        console.log('CustomComponent Debug: Reference object detected, needs resolution:', referenceGlobalSchema)
        return {
          title: 'Reference Not Resolved',
          subtitle: 'The global schema reference needs to be resolved',
          content: 'Please check that the reference is properly resolved in the parent component.',
          showError: true
        }
      }
      
      // Check if it's a feature list reference
      if (referenceGlobalSchema.dataType === 'featureList') {
        return {
          title: referenceGlobalSchema.featureList?.title || 'Features',
          subtitle: referenceGlobalSchema.featureList?.description || 'Our comprehensive feature list',
          content: 'Explore all the features we offer',
          showFeatureList: true
        }
      }
      // Default to comparison table
      return {
        title: 'VoiceStack Comparison Table',
        subtitle: 'Compare our different plans and features',
        content: 'This comparison table shows the differences between our various service tiers and features.',
        showComparisonTable: true
      }
    }
    return null
  }

  /**
   * Get comparison table data from global schema
   */
  const getComparisonTableData = () => {
    // First try to get from slugData (passed from page)
    if (slugData?.comparisonTableData) {
      return slugData.comparisonTableData
    }
    
    // Then try from referenceGlobalSchema - data flows automatically!
    if (referenceGlobalSchema) {
      // If it's a resolved reference (has _id), use it directly
      if (referenceGlobalSchema._id) {
        return referenceGlobalSchema
      }
      // If it's still a reference object, return it as is
      return referenceGlobalSchema
    }
    return null
  }

  /**
   * Get feature list data from global schema
   */
  const getFeatureListData = () => {
    if (referenceGlobalSchema?.dataType === 'featureList') {
      // If it's a resolved reference (has _id), use it directly
      if (referenceGlobalSchema._id) {
        return referenceGlobalSchema
      }
      // If it's still a reference object, return it as is
      return referenceGlobalSchema
    }
    return null
  }

  // Use referenced data if local data is empty
  const referencedData = getReferencedData()
  const comparisonTableData = getComparisonTableData()
  const featureListData = getFeatureListData()
  
  
  const finalTitle = title || referencedData?.title
  const finalSubtitle = subtitle || referencedData?.subtitle
  const finalContent = content || referencedData?.content

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

  /**
   * Render comparison table
   */
  const renderComparisonTable = () => {
    // Get the actual comparison table data from slugData or global schema reference
    const comparisonData = slugData?.comparisonTableData || referenceGlobalSchema?.comparisonTable || referenceGlobalSchema
    
    console.log('Comparison table data:', comparisonData)
    
    if (!comparisonData) {
      return (
        <div className="mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-center">
            <strong>No comparison table data found.</strong><br/>
            Please check your CMS configuration for the comparison table.
          </p>
        </div>
      )
    }

    // Extract table structure from CMS data - handle nested structure
    const tableData = comparisonData.comparisonTable || comparisonData
    const tableTitle = tableData.title || comparisonData.title || "Comparison Table"
    const columns = tableData.columns || []
    const rows = tableData.rows || []

    console.log('Table data extraction:', {
      tableData,
      tableTitle,
      columnsLength: columns.length,
      rowsLength: rows.length,
      columns,
      rows
    })

    // If no structured data, show a simple table with the available data
    console.log('Condition check:', {
      columnsLength: columns.length,
      rowsLength: rows.length,
      conditionResult: columns.length === 0 && rows.length === 0,
      shouldRenderTable: !(columns.length === 0 && rows.length === 0)
    })
    
    if (columns.length === 0 && rows.length === 0) {
      return (
        <div className="mt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">{tableTitle}</h3>
            <p className="text-gray-600">Comparison table is configured but no data is available yet.</p>
          </div>
          
          <div className="mt-8 p-8 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-800 text-center">
              <strong>Comparison Table Ready!</strong><br/>
              The comparison table component is working. Add your comparison data in the CMS to see the table.
            </p>
            <div className="mt-4 text-sm text-blue-600">
              <p><strong>Available data:</strong></p>
              <pre className="mt-2 p-2 bg-white rounded text-left overflow-auto">
                {JSON.stringify(comparisonData, null, 2)}
              </pre>
              <p className="mt-2"><strong>Table data:</strong></p>
              <pre className="mt-2 p-2 bg-white rounded text-left overflow-auto">
                {JSON.stringify(tableData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="mt-12">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-2">{tableTitle}</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-6 py-4 text-left font-semibold">
                  Features
                </th>
                {columns.map((column: any, index: number) => (
                  <th key={index} className="border border-gray-300 px-6 py-4 text-center font-semibold">
                    <div className="flex items-center justify-center">
                      <span>{column.header || column.title || column.name || `Column ${index + 1}`}</span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row: any, rowIndex: number) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-6 py-4 font-medium">
                    {row.feature || row.title || row.name || `Feature ${rowIndex + 1}`}
                  </td>
                  {row.values?.map((value: any, valueIndex: number) => (
                    <td key={valueIndex} className="border border-gray-300 px-6 py-4 text-center">
                      <span className="text-gray-700">
                        {value.text || value.value || value === true ? '✓' : value === false ? '✗' : value || '-'}
                      </span>
                    </td>
                  )) || row.columns?.map((col: any, colIndex: number) => (
                    <td key={colIndex} className="border border-gray-300 px-6 py-4 text-center">
                      <span className="text-gray-700">
                        {col.text || col.value || col === true ? '✓' : col === false ? '✗' : col || '-'}
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

  /**
   * Feature List Component
   */
  const FeatureListComponent = () => {
    const [allFeatures, setAllFeatures] = useState([])
    const [loading, setLoading] = useState(false)


    if (!featureListData) {
      return (
        <div className="mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">
              Feature List Data Not Available
            </h3>
            <p className="text-yellow-700">
              The referenced feature list data could not be loaded.
            </p>
          </div>
        </div>
      )
    }

    // Check if we should select all features
    let features = []
    let displaySettings = {}
    
    if (featureListData.featureList?.selectAllFeatures) {
      if (loading) {
        return (
          <div className="mt-12 p-8 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Loading All Features...
              </h3>
              <p className="text-blue-700">
                Fetching all features from the Features section...
              </p>
            </div>
          </div>
        )
      }

      if (allFeatures.length === 0) {
        return (
          <div className="mt-12 p-8 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                No Features Found
              </h3>
              <p className="text-yellow-700">
                No features were found in the Features section. Please add some features first.
              </p>
            </div>
          </div>
        )
      }

      // Use all features with default display settings
      features = allFeatures
      displaySettings = {
        layout: 'grid',
        itemsPerRow: 3,
        showCategories: true,
        showSearch: true,
        showCTAs: true,
        highlightedFeaturesFirst: false
      }
    } else {
      // Get the actual feature list data from reference
      const featureList = featureListData.featureListReference || featureListData
      features = featureList?.featureReferences || []
      displaySettings = featureList?.displaySettings || featureListData?.displaySettings || {}
    }

    if (features.length === 0) {
      return (
        <div className="mt-12 p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Features Available
            </h3>
            <p className="text-gray-600">
              This feature list doesn&apos;t contain any features yet.
            </p>
          </div>
        </div>
      )
    }

    console.log('CustomComponent: Rendering features:', features.length, 'features')

    return (
      <div className="mt-12">        
        <CategoryFeatureTabs features={features} />
      </div>
    )
  }

  return (
    <section className={`py-16 ${getBackgroundClasses()}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            {/* Title */}
            {finalTitle && (
              <h2 className="text-3xl font-bold mb-4">{finalTitle}</h2>
            )}
            
            {/* Subtitle */}
            {finalSubtitle && (
              <p className="text-xl text-gray-600 mb-8">{finalSubtitle}</p>
            )}
            
            {/* Content */}
            {finalContent && (
              <p className="text-gray-700 mb-8">{finalContent}</p>
            )}
            
            {/* Image */}
            {image && (
              <div className="mb-8">
                <img
                  src={urlForImage(image)}
                  alt={finalTitle}
                  className="w-full h-auto rounded-lg shadow-lg mx-auto"
                />
              </div>
            )}
            
            {/* Button */}
            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {buttonText}
              </a>
            )}
            
            {/* Comparison Table - Show when referenceGlobalSchema is set and dataType is comparisonTable */}
            {referenceGlobalSchema?.dataType === 'comparisonTable' && renderComparisonTable()}
            
            {/* Feature List - Show when referenceGlobalSchema is set and dataType is featureList */}
            {referenceGlobalSchema?.dataType === 'featureList' && (
              <FeatureListComponent />
            )}
            
            {/* Data Source Attribution */}
            {referenceGlobalSchema && (
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600">
                  <strong>Data Source:</strong> Referenced from Global Schema - {referenceGlobalSchema.dataType === 'featureList' ? 'Feature List' : 'Comparison Table'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default CustomComponent
