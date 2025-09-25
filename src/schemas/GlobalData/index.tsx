const GlobalData = {
  name: 'globalData',
  title: 'Global Data',
  type: 'document',
  fields: [
    {
      name: 'dataType',
      title: 'Data Type',
      type: 'string',
      options: {
        list: [
          { title: 'Comparison Table', value: 'comparisonTable' },
          { title: 'Tabs Listing', value: 'tabsListingComponent' },
          { title: 'Custom Content', value: 'customContent' },
          { title: 'Feature List', value: 'featureList' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'name',
      title: 'Data Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Data Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    // Comparison Table Fields - Using the same structure as comparisonTable schema
    {
      name: 'comparisonTable',
      title: 'Comparison Table Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'comparisonTable',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'columns',
          title: 'Columns',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Column Name',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'logo',
                  title: 'Logo',
                  type: 'image',
                },
                {
                  name: 'logoMobile',
                  title: 'Logo Mobile',
                  type: 'image',
                },
              ],
            },
          ],
        },
        {
          name: 'rowCategories',
          title: 'Row Categories',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Category Name',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'iconSvgCode',
                  title: 'Icon Svg Code',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'icon',
                  title: 'Icon',
                  type: 'image',
                },
                {
                  name: 'rows',
                  title: 'Rows',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      fields: [
                        {
                          name: 'heading',
                          title: 'Row Heading',
                          type: 'string',
                          validation: (Rule: any) => Rule.required(),
                        },
                        {
                          name: 'description',
                          title: 'Description',
                          type: 'string',
                        },
                        {
                          name: 'comparisons',
                          title: 'Comparisons',
                          type: 'array',
                          of: [
                            {
                              type: 'reference',
                              to: [{ type: 'comparisonValue' }],
                            }
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'language',
          type: 'string',
          readOnly: true,
          hidden: true,
        },
        {
          name: 'comparisonValues',
          title: 'Comparison Values (Referenced)',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{ type: 'comparisonValue' }],
            }
          ],
          description: 'These are the comparison values that can be referenced in the table rows above. Each comparison value contains an icon and text (e.g., "Advanced", "Basic", "Does Not Exist"). Create and manage them in the Comparisons & Analysis section.',
        },
      ],
    },
    // Tabs Listing Component Fields
    {
      name: 'tabsListingComponent',
      title: 'Tabs Listing Component Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'tabsListingComponent',
      fields: [
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
          name: 'showCTA',
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
                  name: 'ctaListItems',
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
                          options: {
                            list: [
                              { title: 'Primary', value: 'primary' },
                              { title: 'Secondary', value: 'secondary' },
                              { title: 'Outline', value: 'outline' },
                              { title: 'Ghost', value: 'ghost' },
                            ],
                          },
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
                  title: 'Testimonial Reference',
                  type: 'reference',
                  to: [{ type: 'testimonialSection' }],
                },
              ],
            },
          ],
        },
      ],
    },
    // Custom Content Fields (fallback)
    {
      name: 'customContent',
      title: 'Custom Content Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'customContent',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'text',
          rows: 4,
        },
        {
          name: 'buttonText',
          title: 'Button Text',
          type: 'string',
        },
        {
          name: 'buttonLink',
          title: 'Button Link',
          type: 'url',
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: true,
          },
        },
        {
          name: 'backgroundColor',
          title: 'Background Color',
          type: 'string',
          options: {
            list: [
              { title: 'White', value: 'white' },
              { title: 'Gray', value: 'gray' },
              { title: 'Blue', value: 'blue' },
              { title: 'Green', value: 'green' },
            ],
          },
          initialValue: 'white',
        },
      ],
    },
    // Feature List Fields
    {
      name: 'featureList',
      title: 'Feature List Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'featureList',
      fields: [
        {
          name: 'title',
          title: 'Feature List Title',
          type: 'string',
        },
        {
          name: 'description',
          title: 'Feature List Description',
          type: 'text',
          rows: 3,
        },
        {
          name: 'featureListReference',
          title: 'Feature List Reference',
          type: 'reference',
          to: [{ type: 'featureList' }],
          description: 'Select a feature list to display',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'displaySettings',
          title: 'Display Settings Override',
          type: 'object',
          description: 'Override display settings from the referenced feature list',
          fields: [
            {
              name: 'layout',
              title: 'Layout Style',
              type: 'string',
              options: {
                list: [
                  { title: 'Grid', value: 'grid' },
                  { title: 'List', value: 'list' },
                  { title: 'Tabs', value: 'tabs' },
                  { title: 'Accordion', value: 'accordion' },
                ]
              }
            },
            {
              name: 'itemsPerRow',
              title: 'Items Per Row (Grid Layout)',
              type: 'number',
              options: {
                list: [
                  { title: '2 Columns', value: 2 },
                  { title: '3 Columns', value: 3 },
                  { title: '4 Columns', value: 4 },
                ]
              }
            },
            {
              name: 'showCategories',
              title: 'Show Category Filtering',
              type: 'boolean',
            },
            {
              name: 'showSearch',
              title: 'Show Search',
              type: 'boolean',
            },
            {
              name: 'showCTAs',
              title: 'Show Call-to-Action Buttons',
              type: 'boolean',
            },
            {
              name: 'highlightedFeaturesFirst',
              title: 'Show Highlighted Features First',
              type: 'boolean',
            },
          ],
        },
        {
          name: 'customTitle',
          title: 'Custom Title Override',
          type: 'string',
          description: 'Override the title from the referenced feature list',
        },
        {
          name: 'customDescription',
          title: 'Custom Description Override',
          type: 'text',
          rows: 3,
          description: 'Override the description from the referenced feature list',
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      dataType: 'dataType',
      subtitle: 'comparisonTable.title',
    },
    prepare(selection: any) {
      const { title, dataType, subtitle } = selection
      return {
        title: title || 'Global Data',
        subtitle: `${dataType || 'Unknown'} - ${subtitle || 'Global data'}`,
      };
    },
  }
}

export default GlobalData
