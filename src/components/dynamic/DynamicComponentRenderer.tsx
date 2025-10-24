import React from 'react'
import { urlForImage } from '~/lib/sanity.image'

// Import individual components
import ListingComponent from './ListingComponent'
import RightImageComponent from './RightImageComponent'
import FeatureGridComponent from './FeatureGridComponent'
import TestimonialComponent from './TestimonialComponent'
import CustomComponent from './CustomComponent'
import TabsListingComponent from './TabsListingComponent'

/**
 * DYNAMIC COMPONENT RENDERER
 * 
 * This is the main component that handles the dynamic rendering system.
 * It separates data structure from presentation using slugs as the bridge.
 * 
 * HOW IT WORKS:
 * 1. User selects Component Type (data structure) in CMS
 * 2. User enters Section Slug (presentation override)
 * 3. System maps slug to component using SLUG_COMPONENT_MAP
 * 4. Component renders with data from the selected type
 * 
 * EXAMPLE:
 * - Component Type: "Listing" (data structure)
 * - Section Slug: "heroGrid" (presentation)
 * - Result: Listing data rendered as FeatureGrid component
 */

interface DynamicComponentProps {
  component: any
  slugData?: {
    [key: string]: any
  }
}

/**
 * SLUG COMPONENT MAPPING
 * 
 * This maps section slugs to their corresponding component types.
 * Users can override the component type by using a predefined slug.
 * 
 * USAGE:
 * - Add new slugs here to create new presentation options
 * - Users can mix and match any data with any component
 */
const SLUG_COMPONENT_MAP: { [key: string]: any } = {
  'heroGrid': {
    componentType: 'FeatureGrid',
    description: 'Displays data as a feature grid layout'
  },
  'testimonialSection': {
    componentType: 'Testimonial',
    description: 'Displays data as testimonials with ratings'
  },
  'testimonial': {
    componentType: 'Testimonial',
    description: 'Alternative slug for testimonial display'
  },
  'listingSection': {
    componentType: 'Listing',
    description: 'Displays data as a simple listing'
  },
  'rightImageSection': {
    componentType: 'RightImage',
    description: 'Displays data with image on the right'
  },
  'customSection': {
    componentType: 'Custom',
    description: 'Displays custom content with global schema references'
  }
}

/**
 * MAIN DYNAMIC COMPONENT RENDERER
 * 
 * This component handles the logic for:
 * - Slug-based component type overrides
 * - Data flow to appropriate components
 * - Fallback handling for missing data
 */
const DynamicComponentRenderer: React.FC<DynamicComponentProps> = ({ 
  component, 
  slugData = {} 
}) => {
  // Extract slug from slugData
  const slug = slugData?.slug
  const predefinedComponent = slug ? SLUG_COMPONENT_MAP[slug] : null

  // Start with the original component type
  let componentToRender = component
  let componentType = component?.componentType

  // Apply slug-based override if exists
  if (predefinedComponent) {
    componentType = predefinedComponent.componentType
    componentToRender = {
      ...component,
      componentType: predefinedComponent.componentType
    }
  }

  // Resolve referenceGlobalSchema if it's a reference
  if (componentToRender?.customComponent?.referenceGlobalSchema?._type === 'reference') {
    const globalData = slugData?.globalData || []
    const refId = componentToRender.customComponent.referenceGlobalSchema._ref
    const resolvedGlobalData = globalData.find((item: any) => item._id === refId)
    
    if (resolvedGlobalData) {
      componentToRender.customComponent.referenceGlobalSchema = resolvedGlobalData
      console.log('DynamicComponentRenderer: Resolved global data reference:', resolvedGlobalData)
    } else {
      console.log('DynamicComponentRenderer: Could not resolve global data reference:', refId)
    }
  }

  // Return null if no valid component
  if (!componentToRender || !componentType) {
    return null
  }

  // Enhance component with slug data
  const enhancedComponent = {
    ...componentToRender,
    slugData
  }

  // Render the appropriate component based on type
  switch (componentType) {
    case 'TabsListing':
      // console.log('Rendering TabsListing component with data:', enhancedComponent.tabsListingComponent)
      return <TabsListingComponent data={enhancedComponent.tabsListingComponent} slugData={slugData} />
    case 'Listing':
      // console.log('Rendering Listing component with data:', enhancedComponent.listingComponent)
      return <ListingComponent data={enhancedComponent.listingComponent} slugData={slugData} />
    case 'RightImage':
      // console.log('Rendering RightImage component with data:', enhancedComponent.rightImageComponent)
      return <RightImageComponent data={enhancedComponent.rightImageComponent} slugData={slugData} />
    case 'FeatureGrid':
      // console.log('Rendering FeatureGrid component with data:', enhancedComponent.featureGridComponent)
      return <FeatureGridComponent data={enhancedComponent.featureGridComponent} slugData={slugData} />
    case 'Testimonial':
      // console.log('Rendering Testimonial component with data:', enhancedComponent.testimonialComponent)
      return <TestimonialComponent data={enhancedComponent.testimonialComponent} slugData={slugData} />
    case 'Custom':
      // console.log('Rendering Custom component with data:', enhancedComponent.customComponent)
      return <CustomComponent data={enhancedComponent.customComponent} slugData={slugData} />
    default:
      console.log('Unknown component type:', componentType)
      return (
        <div className="py-16 bg-red-50 border border-red-200 rounded-lg mx-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Component Error</h3>
            <p className="text-red-600">Unknown component type: {componentType}</p>
          </div>
        </div>
      )
  }
}

export default DynamicComponentRenderer
