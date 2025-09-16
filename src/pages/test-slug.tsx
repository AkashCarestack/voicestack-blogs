import React from 'react'
import DynamicComponentRenderer from '~/components/DynamicComponentRenderer'

export default function TestSlugPage() {
  // Mock data to test the predefined slug functionality
  const mockSections = [
    {
      title: 'Hero Grid Section',
      slug: { current: 'heroGrid' },
      component: {
        componentType: 'listingComponent', // This will be changed to FeatureGrid
        listingComponent: {
          title: 'Original Component Data',
          description: 'This will be used as featureGridComponent data',
          items: [
            { title: 'Item 1', description: 'Description 1' },
            { title: 'Item 2', description: 'Description 2' }
          ],
          layout: 'grid'
        }
      }
    },
    {
      title: 'Testimonial Section',
      slug: { current: 'testimonialSection' },
      component: {
        componentType: 'listingComponent', // This will be changed to Testimonial
        listingComponent: {
          title: 'Original Component Data',
          description: 'This will be used as testimonialComponent data',
          items: [
            { title: 'Item 1', description: 'Description 1' }
          ],
          layout: 'grid'
        }
      }
    },
    {
      title: 'Regular Section (No Predefined Slug)',
      slug: { current: 'regular-section' },
      component: {
        componentType: 'listingComponent',
        listingComponent: {
          title: 'Regular Listing Component',
          description: 'This uses the original component data',
          items: [
            { title: 'Item 1', description: 'Description 1' },
            { title: 'Item 2', description: 'Description 2' }
          ],
          layout: 'grid'
        }
      }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Slug-based Content Loading Test</h1>
          
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4">Component Type Override Test</h2>
            <p className="text-gray-600 mb-4">
              This page tests how predefined slugs override component types while keeping the original component data. 
              Only the component type changes, the data remains the same.
            </p>
            
            <div className="space-y-4">
              {mockSections.map((section, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Section: {section.title || 'Untitled'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Slug: {section.slug?.current || 'No slug'}
                  </p>
                  
                  {section.component && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-md font-medium mb-2">Component with Slug Data:</h4>
                      <DynamicComponentRenderer 
                        component={section.component}
                        slugData={{
                          slug: section.slug?.current,
                          title: section.title,
                          pageType: 'whoWeServe',
                          language: 'en',
                          sectionIndex: index
                        }}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">How Component Type Override Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li><strong>Component Type Only:</strong> Predefined slugs only specify component type, no data</li>
              <li><strong>Keep Original Data:</strong> Original component data is preserved and used</li>
              <li><strong>Type Override:</strong> Only the component type changes based on slug</li>
              <li><strong>Data Flow:</strong> Original component data flows to the new component type</li>
              <li><strong>Fallback:</strong> When slug doesn't match, uses original component type and data</li>
            </ol>
            
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Available Predefined Slugs:</h4>
              <ul className="list-disc list-inside text-yellow-700 space-y-1">
                <li><code>heroGrid</code> → Changes component type to FeatureGrid</li>
                <li><code>testimonialSection</code> → Changes component type to Testimonial</li>
                <li><code>listingSection</code> → Changes component type to Listing</li>
                <li><code>rightImageSection</code> → Changes component type to RightImage</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
