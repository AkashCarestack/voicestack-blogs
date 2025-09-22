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
          { title: 'Tabs Listing Component', value: 'TabsListing' },
          { title: 'Custom Component', value: 'Custom' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    // Dynamic component fields based on type
    {
      name: 'tabsListingComponent',
      title: 'Tabs Listing Component',
      type: 'tabsListingComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'TabsListing',
    },
    {
      name: 'customComponent',
      title: 'Custom Component',
      type: 'customComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'Custom',
    },
  ],
  preview: {
    select: {
      title: 'componentType',
      tabsTitle: 'tabsListingComponent.headline',
      customTitle: 'customComponent.title',
    },
    prepare(selection: any) {
      const { componentType, tabsTitle, customTitle } = selection;
      
      let title = componentType || 'Dynamic Component';
      let subtitle = '';
      
      // Get the actual title from the selected component
      if (componentType === 'TabsListing' && tabsTitle) {
        subtitle = tabsTitle;
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