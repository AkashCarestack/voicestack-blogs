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
          { title: 'Feature List', value: 'featureList' },
          { title: 'Pricing Data', value: 'pricingData' },
          { title: 'Testimonial Data', value: 'testimonialData' },
          { title: 'Custom Content', value: 'customContent' },
          { title: 'Tabs Listing', value: 'tabsListingComponent' },
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
    // Comparison Table Fields
    {
      name: 'comparisonTable',
      title: 'Comparison Table Data',
      type: 'object',
      hidden: ({ parent }: any) => parent?.dataType !== 'comparisonTable',
      fields: [
        {
          name: 'title',
          title: 'Table Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Table Subtitle',
          type: 'string',
        },
        {
          name: 'columns',
          title: 'Table Columns',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'column',
              title: 'Column',
              fields: [
                {
                  name: 'header',
                  title: 'Column Header',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'highlighted',
                  title: 'Highlighted Column',
                  type: 'boolean',
                  initialValue: false,
                },
                {
                  name: 'badge',
                  title: 'Badge Text',
                  type: 'string',
                },
              ],
            },
          ],
        },
        {
          name: 'tabsListing',
          title: 'Tabs Listing',
          type: 'object',
          hidden: ({ parent }: any) => parent?.dataType !== 'tabsListingComponent',
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
                                title: 'List Items',
                                type: 'array',
                                of: [
                                    {
                                        type: 'object',
                                        fields: [
                                            {
                                                name: 'listHeading',
                                                title: 'List Heading',
                                                type: 'string',
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
                                                //dropdwon akanm
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
        },


        {
          name: 'rows',
          title: 'Table Rows',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'row',
              title: 'Row',
              fields: [
                {
                  name: 'feature',
                  title: 'Feature Name',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'values',
                  title: 'Values',
                  type: 'array',
                  of: [
                    {
                      type: 'object',
                      name: 'value',
                      title: 'Value',
                      fields: [
                        {
                          name: 'text',
                          title: 'Value Text',
                          type: 'string',
                        },
                        {
                          name: 'type',
                          title: 'Value Type',
                          type: 'string',
                          options: {
                            list: [
                              { title: 'Checkmark', value: 'check' },
                              { title: 'Cross', value: 'cross' },
                              { title: 'Text', value: 'text' },
                              { title: 'Number', value: 'number' },
                            ],
                          },
                          initialValue: 'text',
                        },
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
    // Feature List Fields
    {
      name: 'featureList',
      title: 'Feature List Data',
      type: 'object',
      hidden: ({ parent }: any) => parent?.dataType !== 'featureList',
      fields: [
        {
          name: 'title',
          title: 'List Title',
          type: 'string',
        },
        {
          name: 'features',
          title: 'Features',
          type: 'array',
          of: [
            {
              type: 'object',
              name: 'feature',
              title: 'Feature',
              fields: [
                {
                  name: 'title',
                  title: 'Feature Title',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'description',
                  title: 'Feature Description',
                  type: 'text',
                },
                {
                  name: 'icon',
                  title: 'Feature Icon',
                  type: 'string',
                },
              ],
            },
          ],
        },
      ],
    },
    // Tabs Listing Component Fields
    {
      name: 'tabsListingComponent',
      title: 'Tabs Listing Component Data',
      type: 'object',
      hidden: ({ parent }: any) => parent?.dataType !== 'tabsListingComponent',
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
    },
    // Custom Content Fields (fallback)
    {
      name: 'customContent',
      title: 'Custom Content Data',
      type: 'object',
      hidden: ({ parent }: any) => parent?.dataType !== 'customContent',
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
  },
}

export default GlobalData
