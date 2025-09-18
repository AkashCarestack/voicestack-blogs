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
    // Pricing Data Fields
    {
      name: 'pricingData',
      title: 'Pricing Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'pricingData',
      fields: [
        {
          name: 'title',
          title: 'Pricing Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Pricing Subtitle',
          type: 'string',
        },
        {
          name: 'plans',
          title: 'Pricing Plans',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Plan Name',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'price',
                  title: 'Price',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'period',
                  title: 'Billing Period',
                  type: 'string',
                },
                {
                  name: 'features',
                  title: 'Features',
                  type: 'array',
                  of: [{ type: 'string' }],
                },
                {
                  name: 'isPopular',
                  title: 'Popular Plan',
                  type: 'boolean',
                },
              ],
            },
          ],
        },
      ],
    },
    // Testimonial Data Fields
    {
      name: 'testimonialData',
      title: 'Testimonial Data',
      type: 'object',
      hidden: ({ parent }: any) => !parent || parent.dataType !== 'testimonialData',
      fields: [
        {
          name: 'title',
          title: 'Testimonial Section Title',
          type: 'string',
        },
        {
          name: 'subtitle',
          title: 'Testimonial Section Subtitle',
          type: 'string',
        },
        {
          name: 'testimonials',
          title: 'Testimonials',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'name',
                  title: 'Customer Name',
                  type: 'string',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'company',
                  title: 'Company',
                  type: 'string',
                },
                {
                  name: 'quote',
                  title: 'Testimonial Quote',
                  type: 'text',
                  validation: (Rule: any) => Rule.required(),
                },
                {
                  name: 'rating',
                  title: 'Rating',
                  type: 'number',
                  validation: (Rule: any) => Rule.min(1).max(5),
                },
                {
                  name: 'avatar',
                  title: 'Customer Avatar',
                  type: 'image',
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
