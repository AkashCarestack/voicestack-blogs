import React from 'react'
import dynamic from 'next/dynamic'

const componentMap = {
  listingBlock: dynamic(() => import('./ListingBlock')),
  browserList: dynamic(
    () => import('./BrowserBlock'),
  ),
}


const DynamicComponent = ({ componentType, ...props }) => {
  // For old miscellaneous dynamic components, detect componentType from props
  // The data structure has listingBlock or browserList directly
  let detectedComponentType = componentType

  if (!detectedComponentType) {
    // Check which component data field exists
    if (props.listingBlock) {
      detectedComponentType = 'listingBlock'
    } else if (props.browserList) {
      detectedComponentType = 'browserList'
    }
  }

  if (!detectedComponentType) {
    console.warn('DynamicComponent: No componentType found and no component data detected', props)
    return null
  }

  const Component = componentMap[detectedComponentType]
  if (!Component) {
    console.warn(`DynamicComponent: Component type "${detectedComponentType}" not found in componentMap`)
    return null
  }

  const componentProps = props[detectedComponentType] || {}

  return <Component {...componentProps} />
}

export default DynamicComponent


