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
      //   {
      //     name:'globalData',
      //     title: 'Global Data (if not provided, data will be fetched from Selected global data)',
      //     type: 'reference', 
      //     to: [{ type: 'globalData' }],
        
      //   },
      //   {
      //     name: 'headline',
      //     title: 'Headline',
      //     type: 'string',
      //   },
      //   {
      //     name: 'subheadline',
      //     title: 'SubHeadline',
      //     type: 'string',
      //   },
      //   {
      //     name:'showCTA',
      //     title: 'Show CTA',
      //     type: 'boolean',
      //   },
      //   {
      //     name: 'subDescription',
      //     title: 'Description',
      //     type: 'string',
      //   },
      //   {
      //     name: 'tabs',
      //     title: 'Tabs',
      //     type: 'array',
      //     of: [
      //       {
      //         type: 'object',
      //         fields: [
      //           {
      //             name: 'tabHeading',
      //             title: 'Heading',
      //             type: 'string',
      //           },
      //           {
      //             name: 'tabSubHeading',
      //             title: 'SubHeading',
      //             type: 'string',
      //           },
      //           {
      //             name: 'description',
      //             title: 'Description',
      //             type: 'string',
      //           },
      //           {
      //             name: 'image',
      //             title: 'Image',
      //             type: 'image',
      //           },
      //           {
      //             name:'listItems',
      //             title: 'Feature List Items',
      //             type: 'array',
      //             of: [
      //               {
      //                 type: 'object',
      //                 fields: [
      //                   {
      //                     name: 'subfeatureHeading',
      //                     title: 'Heading',
      //                     type: 'string',
      //                   },
      //                   {
      //                     name: 'subfeatureSubheading',
      //                     title: 'Subheading ',
      //                     type: 'string',
      //                   },
      //                   {
      //                     name: 'subfeatureDescription',
      //                     title: 'Description',
      //                     type: 'string',
      //                   },
      //                   {
      //                     name: 'subfeatureImage',
      //                     title: 'Image',
      //                     type: 'image',
      //                   },
      //                 ],
                    
      //               },
      //             ],
      //           },
      //           {
      //             name: 'icon',
      //             title: 'Icon (SVG)',
      //             type: 'text',
      //           },
      //           {
      //             name:'ctaListItems',
      //             title: 'Call to Action List',
      //             type: 'array',
      //             of: [
      //               {
      //                 type: 'object',
      //                 fields: [
      //                   {
      //                     name: 'ctaLink',
      //                     title: 'CTA Link',
      //                     type: 'string',
      //                   },
      //                   {
      //                     name: 'ctaText',
      //                     title: 'CTA Text',
      //                     type: 'string',
      //                   },
      //                   {
      //                     name: 'ctaType',
      //                     title: 'Button type',
      //                     type: 'string',
      //                   },
      //                 ],
      //               },
      //             ],
      //           },
      //           {
      //             name: 'Link',
      //             title: 'Link (href)',
      //             type: 'string',
      //           },
      //           {
      //             name: 'LinkText',
      //             title: 'Link Text',
      //             type: 'string',
      //           },
      //           {
      //             name: 'testimonial',
      //             title: 'testimonial (referenced region Based)',
      //             type: 'string',
      //           },
      //         ],
      //       },
      //     ],
      //   },
      // ],
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