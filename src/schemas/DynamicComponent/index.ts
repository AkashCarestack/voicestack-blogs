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
          { title: 'Hero Component', value: 'Hero' },
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
    {
      name: 'heroComponent',
      title: 'Hero Component',
      type: 'heroComponent',
      hidden: ({ parent }: any) => parent?.componentType !== 'Hero',
    },
  ],
  preview: {
    select: {
      title: 'componentType',
      tabsTitle: 'tabsListingComponent.headline',
      customTitle: 'customComponent.title',
      heroTitle: 'heroComponent.heroheading',
      heroStrip: 'heroComponent.heroStrip',
    },
    prepare(selection: any) {
      const { componentType, tabsTitle, customTitle, heroTitle, heroStrip } = selection;
      
      let title = componentType || 'Dynamic Component';
      let subtitle = '';
      
      // Get the actual title from the selected component
      if (componentType === 'TabsListing' && tabsTitle) {
        subtitle = tabsTitle;
      } else if (componentType === 'Custom' && customTitle) {
        subtitle = customTitle;
      } else if (componentType === 'Hero') {
        // Extract text from blockContent for hero title
        if (heroTitle && Array.isArray(heroTitle) && heroTitle.length > 0) {
          const firstBlock = heroTitle[0];
          if (firstBlock.children && firstBlock.children.length > 0) {
            subtitle = firstBlock.children[0].text || heroStrip || 'Hero Component';
          }
        } else {
          subtitle = heroStrip || 'Hero Component';
        }
      }
      
      return {
        title: subtitle || title,
        subtitle: subtitle ? `Type: ${title}` : '',
      };
    },
  },
}

export default [dynamicComponent, ...componentSchemas]