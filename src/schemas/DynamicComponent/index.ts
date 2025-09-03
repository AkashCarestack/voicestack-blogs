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
          { title: 'Listing Component', value: 'listingComponent' },
          { title: 'Right Image Component', value: 'rightImageComponent' },
          { title: 'Feature Grid Component', value: 'featureGridComponent' },
          { title: 'Testimonial Component', value: 'testimonialComponent' },
          { title: 'Custom Component', value: 'customComponent' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    // Dynamic component fields based on type
    {
      name: 'listingComponent',
      title: 'Listing Component',
      type: 'listingComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'listingComponent',
    },
    {
      name: 'rightImageComponent',
      title: 'Right Image Component',
      type: 'rightImageComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'rightImageComponent',
    },
    {
      name: 'featureGridComponent',
      title: 'Feature Grid Component',
      type: 'featureGridComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'featureGridComponent',
    },
    {
      name: 'testimonialComponent',
      title: 'Testimonial Component',
      type: 'testimonialComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'testimonialComponent',
    },
    {
      name: 'customComponent',
      title: 'Custom Component',
      type: 'customComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'customComponent',
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
      if (componentType === 'listingComponent' && componentTitle) {
        subtitle = componentTitle;
      } else if (componentType === 'rightImageComponent' && rightImageTitle) {
        subtitle = rightImageTitle;
      } else if (componentType === 'featureGridComponent' && featureGridTitle) {
        subtitle = featureGridTitle;
      } else if (componentType === 'testimonialComponent' && testimonialTitle) {
        subtitle = testimonialTitle;
      } else if (componentType === 'customComponent' && customTitle) {
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
