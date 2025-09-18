import React from 'react'

interface TabsListingComponentProps {
  data: any
  slugData?: any
}

export default function TabsListingComponent({ data, slugData }: TabsListingComponentProps) {
  if (!data) {
    return (
      <div className="py-8 bg-yellow-50 border border-yellow-200 rounded-lg mx-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Tabs Listing Component</h3>
          <p className="text-yellow-600">No data provided</p>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 bg-blue-50 border border-blue-200 rounded-lg mx-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Tabs Listing Component</h3>
        <p className="text-blue-600">Title: {data.title || 'No title'}</p>
        {data.description && (
          <p className="text-blue-600 mt-2">Description: {data.description}</p>
        )}
        <pre className="mt-4 text-xs bg-white p-2 rounded border overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  )
}
