import React from 'react'
import { ReferenceInput } from 'sanity'
import { TagIcon } from '@sanity/icons'

interface FeatureCategoryReferenceProps {
  value?: any
  onChange?: (value: any) => void
  document?: any
}

const FeatureCategoryReference: React.FC<FeatureCategoryReferenceProps> = (props) => {
  return (
    <ReferenceInput
      {...props}
      to={[{ type: 'featureCategory' }]}
      options={{
        disableNew: false
      }}
      icon={TagIcon}
    />
  )
}

export default FeatureCategoryReference
