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
          { title: 'Tabs listing ', value: 'TabsListing' },
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
      name: 'tabsListingComponent',
      title: 'Tabs Listing Component',
      type: 'object',
      fields: [
        {
          name:'globalData',
          title: 'Global Data (if not provided, data will be fetched from Selected global data)',
          type: 'reference', 
          to: [{ type: 'globalData' }],
        },
        {
          name: 'slug',
          title: 'Data Slug',
          type: 'slug',
          options: {
            source: 'headline',
            maxLength: 96,
          },
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
        },
        {
          name: 'subheadline',
          title: 'SubHeadline',
          type: 'string',
        },
        {
          name:'showCTA',
          title: 'Show CTA',
          type: 'boolean',
        },
        {
          name: 'subDescription',
          title: 'Description',
          type: 'string',
        },
        {
          name: 'tabs',
          title: 'Tabs',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'tabHeading',
                  title: 'Heading',
                  type: 'string',
                },
                {
                  name: 'tabSubHeading',
                  title: 'SubHeading',
                  type: 'string',
                },
                {
                  name: 'description',
                  title: 'Description',
                  type: 'string',
                },
                {
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                },
                {
                  name:'listItems',
                  title: 'Feature List Items',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'subfeatureHeading',
                          title: 'Heading',
                          type: 'string',
                        },
                        {
                          name: 'subfeatureSubheading',
                          title: 'Subheading ',
                          type: 'string',
                        },
                        {
                          name: 'subfeatureDescription',
                          title: 'Description',
                          type: 'string',
                        },
                        {
                          name: 'subfeatureImage',
                          title: 'Image',
                          type: 'image',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'icon',
                  title: 'Icon (SVG)',
                  type: 'text',
                },
                {
                  name:'ctaListItems',
                  title: 'Call to Action List',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'ctaLink',
                          title: 'CTA Link',
                          type: 'string',
                        },
                        {
                          name: 'ctaText',
                          title: 'CTA Text',
                          type: 'string',
                        },
                        {
                          name: 'ctaType',
                          title: 'Button type',
                          type: 'string',
                        },
                      ],
                    },
                  ],
                },
                {
                  name: 'Link',
                  title: 'Link (href)',
                  type: 'string',
                },
                {
                  name: 'LinkText',
                  title: 'Link Text',
                  type: 'string',
                },
                {
                  name: 'testimonial',
                  title: 'testimonial (referenced region Based)',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
      hidden: ({ parent }: any) => parent?.componentType !== 'TabsListing',
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
      tabsListingTitle:'tabsListingComponent.title',
    },
    prepare(selection: any) {
      const { componentType, componentTitle, rightImageTitle, featureGridTitle, testimonialTitle, customTitle ,tabsListingTitle } = selection;
      
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
      } else if (componentType === 'TabsListing' && tabsListingTitle) {
        subtitle = tabsListingTitle;
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
