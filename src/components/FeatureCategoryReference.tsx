import React from 'react'

interface FeatureCategoryReferenceProps {
  value?: any
  onChange?: (value: any) => void
  document?: any
}

const FeatureCategoryReference: React.FC<FeatureCategoryReferenceProps> = (props) => {
  return (
    <div className="p-4 border border-gray-300 rounded">
      <p className="text-sm text-gray-600">Feature Category Reference</p>
      <p className="text-xs text-gray-500 mt-1">This component needs to be implemented with proper Sanity ReferenceInput props.</p>
    </div>
  )
}

export default FeatureCategoryReference