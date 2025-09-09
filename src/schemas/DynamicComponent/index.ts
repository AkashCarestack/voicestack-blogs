import { InsertBelowIcon } from '@sanity/icons'
import { componentSchemas } from './Components'

const dynamicComponent = {
  name: 'dynamicComponent',
  title: 'Dynamic Component',
  icon: InsertBelowIcon,
  type: 'object',
  fields: [
    {
      name: 'componentType',
      title: 'Component Type',
      type: 'string',
      options: {
        list: [
          { title: 'Listing Component', value: 'Listing' },
          { title: 'Right Image Component', value: 'RightImage' },
          { title: 'Feature Grid Component', value: 'FeatureGrid' },
          { title: 'Testimonial Component', value: 'Testimonial' },
          { title: 'Custom Component', value: 'Custom' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    // Dynamic component fields based on type
    {
      name: 'listingComponent',
      title: 'Listing Component',
      type: 'listingComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'Listing',
    },
    {
      name: 'rightImageComponent',
      title: 'Right Image Component',
      type: 'rightImageComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'RightImage',
    },
    {
      name: 'featureGridComponent',
      title: 'Feature Grid Component',
      type: 'featureGridComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'FeatureGrid',
    },
    {
      name: 'testimonialComponent',
      title: 'Testimonial Component',
      type: 'testimonialComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'Testimonial',
    },
    {
      name: 'customComponent',
      title: 'Custom Component',
      type: 'customComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'Custom',
    },
    // Removed listingBlock and browserList - not needed
  ],
  preview: {
    select: {
      title: 'componentType',
      componentTitle: 'listingComponent.title',
      rightImageTitle: 'rightImageComponent.title',
      featureGridTitle: 'featureGridComponent.title',
      testimonialTitle: 'testimonialComponent.title',
      customTitle: 'customComponent.title',
    },
    prepare(selection: any) {
      const { componentType, componentTitle, rightImageTitle, featureGridTitle, testimonialTitle, customTitle } = selection;
      
      let title = componentType || 'Dynamic Component';
      let subtitle = '';
      
      // Get the actual title from the selected component
      if (componentType === 'Listing' && componentTitle) {
        subtitle = componentTitle;
      } else if (componentType === 'RightImage' && rightImageTitle) {
        subtitle = rightImageTitle;
      } else if (componentType === 'FeatureGrid' && featureGridTitle) {
        subtitle = featureGridTitle;
      } else if (componentType === 'Testimonial' && testimonialTitle) {
        subtitle = testimonialTitle;
      } else if (componentType === 'Custom' && customTitle) {
        subtitle = customTitle;
      }
      
      return {
        title: subtitle || title,
        subtitle: subtitle ? `Type: ${title}` : '',
      };
    },
  },
}

export default [dynamicComponent, ...componentSchemas]
