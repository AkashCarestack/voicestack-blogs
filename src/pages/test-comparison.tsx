import React from 'react'
import DynamicComponentRenderer from '~/components/dynamic/DynamicComponentRenderer'

const TestComparisonPage = () => {
  // Mock data to test the comparison table functionality
  const mockSections = [
    {
      title: 'Test Comparison Table',
      slug: { current: 'customSection' },
      component: {
        componentType: 'Custom',
        customComponent: {
          title: 'Our Software Comparison',
          subtitle: 'Choose the perfect plan for your practice',
          content: 'Compare our different software plans and find the one that fits your needs.',
          backgroundColor: 'white',
          // Reference fields for Global Data
          referenceGlobalSchema: {
            _ref: 'global-data-comparison'
          },
          referenceSchemaSlug: 'dental-software-comparison'
        }
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Test Comparison Table</h1>
        
        <div className="max-w-6xl mx-auto">
          {mockSections.map((section, index) => (
            <div key={index} className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <DynamicComponentRenderer
                component={section.component}
                slugData={{
                  slug: section.slug?.current,
                  title: section.title,
                  pageType: 'test',
                  language: 'en',
                  sectionIndex: index
                }}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-white rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">How to Test:</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Go to Sanity CMS → Global Data</li>
            <li>Create a new Global Data document</li>
            <li>Set Data Type to "Comparison Table"</li>
            <li>Fill in the comparison table data (columns, rows, etc.)</li>
            <li>Set the Data Slug to "dental-software-comparison"</li>
            <li>Save the document</li>
            <li>Refresh this page to see the comparison table</li>
          </ol>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              <strong>Note:</strong> Currently showing mock data. Once you create the Global Data in CMS, 
              the component will automatically fetch and display the real comparison table data.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestComparisonPage
